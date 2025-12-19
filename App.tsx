
import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { Player, GameState } from './types';
import { INITIAL_BOARD } from './constants';
import { calculateWinner, getAIMove } from './services/gameLogic';
import { getAICommentary } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    isXNext: true,
    winner: null,
    winningLine: null,
    aiCommentary: "Welcome! Moves disappear after your 3rd turn.",
    isThinking: false,
    xMoveHistory: [],
    oMoveHistory: [],
  });

  const [scores, setScores] = useState({ human: 0, ai: 0 });

  const handleSquareClick = useCallback((i: number) => {
    if (gameState.board[i] || gameState.winner || !gameState.isXNext || gameState.isThinking) return;

    setGameState(prev => {
      const newBoard = [...prev.board];
      let newXHistory = [...prev.xMoveHistory, i];
      newBoard[i] = 'X';
      
      const result = calculateWinner(newBoard);
      
      // If win, don't remove anything
      if (result?.winner === 'X') {
        setScores(s => ({ ...s, human: s.human + 1 }));
        return {
          ...prev,
          board: newBoard,
          xMoveHistory: newXHistory,
          isXNext: false,
          winner: 'X',
          winningLine: result.line,
        };
      }

      // If no win and more than 3 pieces, remove the oldest
      if (newXHistory.length > 3) {
        const oldestIdx = newXHistory.shift();
        if (oldestIdx !== undefined) {
          newBoard[oldestIdx] = null;
        }
      }

      return {
        ...prev,
        board: newBoard,
        xMoveHistory: newXHistory,
        isXNext: false,
        winner: null,
      };
    });
  }, [gameState.board, gameState.winner, gameState.isXNext, gameState.isThinking]);

  // AI Move logic
  useEffect(() => {
    if (!gameState.isXNext && !gameState.winner) {
      setGameState(prev => ({ ...prev, isThinking: true }));
      
      const timer = setTimeout(() => {
        setGameState(prev => {
          const aiIdx = getAIMove(prev.board, prev.xMoveHistory, prev.oMoveHistory);
          const newBoard = [...prev.board];
          let newOHistory = [...prev.oMoveHistory, aiIdx];
          newBoard[aiIdx] = 'O';
          
          const result = calculateWinner(newBoard);
          
          if (result?.winner === 'O') {
            setScores(s => ({ ...s, ai: s.ai + 1 }));
            return {
              ...prev,
              board: newBoard,
              oMoveHistory: newOHistory,
              isXNext: true,
              winner: 'O',
              winningLine: result.line,
              isThinking: false,
            };
          }

          if (newOHistory.length > 3) {
            const oldestIdx = newOHistory.shift();
            if (oldestIdx !== undefined) {
              newBoard[oldestIdx] = null;
            }
          }

          return {
            ...prev,
            board: newBoard,
            oMoveHistory: newOHistory,
            isXNext: true,
            winner: null,
            isThinking: false,
          };
        });
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isXNext, gameState.winner]);

  useEffect(() => {
    const fetchCommentary = async () => {
      const commentary = await getAICommentary(gameState.board, gameState.winner);
      setGameState(prev => ({ ...prev, aiCommentary: commentary }));
    };

    const movesCount = gameState.board.filter(b => b !== null).length;
    if (gameState.winner || (movesCount > 0 && movesCount % 2 === 0)) {
      fetchCommentary();
    }
  }, [gameState.winner, gameState.board]);

  const resetGame = () => {
    setGameState({
      board: INITIAL_BOARD,
      isXNext: true,
      winner: null,
      winningLine: null,
      isThinking: false,
      xMoveHistory: [],
      oMoveHistory: [],
      aiCommentary: "New game! Watch your pieces...",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Infinity Tic Tac Toe</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Oldest moves disappear</p>
        <div className="flex justify-center gap-6 text-sm font-semibold">
          <span className="text-blue-600">Human (X): {scores.human}</span>
          <span className="text-red-600">AI (O): {scores.ai}</span>
        </div>
      </header>

      <main className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="w-full bg-white p-4 rounded-lg border border-gray-100 text-center shadow-sm">
          <p className="text-sm text-gray-600 italic">
            {gameState.isThinking ? "AI is calculating futures..." : gameState.aiCommentary}
          </p>
        </div>

        <Board 
          squares={gameState.board} 
          onClick={handleSquareClick}
          winningLine={gameState.winningLine}
          xMoveHistory={gameState.xMoveHistory}
          oMoveHistory={gameState.oMoveHistory}
          isXNext={gameState.isXNext}
          disabled={!gameState.isXNext || !!gameState.winner}
        />

        {gameState.winner && (
          <div className="text-xl font-bold text-gray-800 animate-bounce">
            {gameState.winner === 'DRAW' ? "It's a draw!" : `${gameState.winner} Wins!`}
          </div>
        )}

        <Controls 
          onReset={resetGame}
          disabled={gameState.isThinking}
        />
      </main>
      
      <footer className="mt-12 text-[10px] text-gray-300 uppercase tracking-widest">
        Max 3 pieces per player
      </footer>
    </div>
  );
};

export default App;
