
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
    aiCommentary: "Welcome! Let's play.",
    isThinking: false,
  });

  const [scores, setScores] = useState({ human: 0, ai: 0 });

  const handleSquareClick = useCallback((i: number) => {
    if (gameState.board[i] || gameState.winner || !gameState.isXNext || gameState.isThinking) return;

    const newBoard = [...gameState.board];
    newBoard[i] = 'X';
    
    const result = calculateWinner(newBoard);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      isXNext: false,
      winner: result?.winner || null,
      winningLine: result?.line || null,
    }));

    if (result?.winner === 'X') setScores(s => ({ ...s, human: s.human + 1 }));
  }, [gameState.board, gameState.winner, gameState.isXNext, gameState.isThinking]);

  useEffect(() => {
    if (!gameState.isXNext && !gameState.winner) {
      setGameState(prev => ({ ...prev, isThinking: true }));
      const timer = setTimeout(() => {
        const aiIdx = getAIMove(gameState.board);
        const newBoard = [...gameState.board];
        newBoard[aiIdx] = 'O';
        
        const result = calculateWinner(newBoard);
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          isXNext: true,
          winner: result?.winner || null,
          winningLine: result?.line || null,
          isThinking: false,
        }));

        if (result?.winner === 'O') setScores(s => ({ ...s, ai: s.ai + 1 }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.isXNext, gameState.winner, gameState.board]);

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
      aiCommentary: "Starting a new game!",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tic Tac Toe</h1>
        <div className="flex justify-center gap-4 text-sm font-medium text-gray-500">
          <span>Human (X): {scores.human}</span>
          <span>AI (O): {scores.ai}</span>
        </div>
      </header>

      <main className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="w-full bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm">
          <p className="text-sm text-gray-600 italic">
            {gameState.isThinking ? "AI is thinking..." : gameState.aiCommentary}
          </p>
        </div>

        <Board 
          squares={gameState.board} 
          onClick={handleSquareClick}
          winningLine={gameState.winningLine}
          disabled={!gameState.isXNext || !!gameState.winner}
        />

        {gameState.winner && (
          <div className="text-lg font-bold text-gray-800">
            {gameState.winner === 'DRAW' ? "It's a draw!" : `${gameState.winner} Wins!`}
          </div>
        )}

        <Controls 
          onReset={resetGame}
          disabled={gameState.isThinking}
        />
      </main>
    </div>
  );
};

export default App;
