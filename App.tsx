
import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { Player, GameState, Difficulty } from './types';
import { INITIAL_BOARD } from './constants';
import { calculateWinner, getAIMove } from './services/gameLogic';
import { getAICommentary } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    isXNext: true,
    winner: null,
    difficulty: Difficulty.HARD,
    winningLine: null,
    aiCommentary: "READY FOR LINK.",
    isThinking: false,
  });

  const [scores, setScores] = useState({ human: 0, ai: 0 });

  // Handle Human Move
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

  // Handle AI Move
  useEffect(() => {
    if (!gameState.isXNext && !gameState.winner) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, isThinking: true }));
        
        const aiIdx = getAIMove(gameState.board, gameState.difficulty);
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
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState.isXNext, gameState.winner, gameState.board, gameState.difficulty]);

  // Handle AI Commentary (Gemini)
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
    setGameState(prev => ({
      ...prev,
      board: INITIAL_BOARD,
      isXNext: true,
      winner: null,
      winningLine: null,
      isThinking: false,
      aiCommentary: "REBOOT COMPLETE.",
    }));
  };

  const setDifficulty = (d: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty: d }));
    resetGame();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 md:p-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black font-orbitron neon-text-cyan tracking-widest mb-1">
          NEON NEURAL
        </h1>
        <div className="flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest opacity-60">
          <span className={gameState.isXNext ? 'neon-text-pink opacity-100' : ''}>HUMAN (X): {scores.human}</span>
          <span className={!gameState.isXNext ? 'neon-text-cyan opacity-100' : ''}>AI (O): {scores.ai}</span>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="w-full max-w-sm flex flex-col items-center gap-6">
        
        {/* Status / Commentary Bar */}
        <div className="w-full neon-border-cyan bg-black/40 px-4 py-3 rounded-md text-center min-h-[60px] flex flex-col justify-center">
          <p className="text-[10px] uppercase font-orbitron text-cyan-500/50 mb-1">
            {gameState.isThinking ? "PROCESSING..." : "CORE STATUS"}
          </p>
          <p className={`text-sm font-medium ${gameState.winner ? 'animate-pulse font-bold' : ''}`}>
             {gameState.winner 
                ? (gameState.winner === 'DRAW' ? 'STALEMATE DETECTED' : `${gameState.winner} HAS WON`)
                : gameState.aiCommentary}
          </p>
        </div>

        {/* The Board */}
        <Board 
          squares={gameState.board} 
          onClick={handleSquareClick}
          winningLine={gameState.winningLine}
          disabled={!gameState.isXNext || !!gameState.winner}
        />

        {/* Simplified Controls */}
        <div className="w-full space-y-4">
          <Controls 
            difficulty={gameState.difficulty}
            onDifficultyChange={setDifficulty}
            onReset={resetGame}
            disabled={gameState.isThinking}
          />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto pt-10 text-[9px] uppercase tracking-[0.4em] opacity-30 font-orbitron">
        SYSTEM_ID: 0x2A // NEURAL_NET_V6
      </footer>
    </div>
  );
};

export default App;
