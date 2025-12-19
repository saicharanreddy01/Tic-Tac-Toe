
import { Player, Move, Difficulty } from '../types';
import { WINNING_LINES } from '../constants';

export const calculateWinner = (squares: Player[]) => {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  if (!squares.includes(null)) {
    return { winner: 'DRAW' as const, line: null };
  }
  return null;
};

const minimax = (board: Player[], depth: number, isMaximizing: boolean): number => {
  const result = calculateWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export const getAIMove = (board: Player[], difficulty: Difficulty): number => {
  const availableMoves = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null) as number[];

  if (difficulty === Difficulty.EASY) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (difficulty === Difficulty.DIFFICULT) {
    // 50/50 chance of being smart or random
    if (Math.random() > 0.5) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // HARD logic or DIFFICULT smart half
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};
