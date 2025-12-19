
import { Player } from '../types';
import { WINNING_LINES } from '../constants';

export const calculateWinner = (squares: Player[]) => {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  // Note: In Infinity Tic-Tac-Toe, a DRAW is technically impossible 
  // because pieces keep moving, but we keep the check for safety.
  if (!squares.includes(null)) {
    return { winner: 'DRAW' as const, line: null };
  }
  return null;
};

const simulateMove = (board: Player[], history: number[], index: number, player: Player): { newBoard: Player[], newHistory: number[] } => {
  const newBoard = [...board];
  const newHistory = [...history, index];
  newBoard[index] = player;

  // If player now has 4 pieces, remove the oldest one
  if (newHistory.length > 3) {
    const oldestIdx = newHistory.shift();
    if (oldestIdx !== undefined) {
      newBoard[oldestIdx] = null;
    }
  }
  return { newBoard, newHistory };
};

const minimax = (
  board: Player[], 
  xHistory: number[], 
  oHistory: number[], 
  depth: number, 
  isMaximizing: boolean
): number => {
  const result = calculateWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }

  if (depth >= 6) return 0; // Depth limit for performance

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const { newBoard, newHistory } = simulateMove(board, oHistory, i, 'O');
        const score = minimax(newBoard, xHistory, newHistory, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const { newBoard, newHistory } = simulateMove(board, xHistory, i, 'X');
        const score = minimax(newBoard, newHistory, oHistory, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export const getAIMove = (board: Player[], xHistory: number[], oHistory: number[]): number => {
  let bestScore = -Infinity;
  let move = -1;
  
  // Basic randomization for variety
  const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
  
  for (const i of availableMoves) {
    const { newBoard, newHistory } = simulateMove(board, oHistory, i, 'O');
    const score = minimax(newBoard, xHistory, newHistory, 0, false);
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }
  
  return move;
};
