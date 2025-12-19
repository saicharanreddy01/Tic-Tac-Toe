
export type Player = 'X' | 'O' | null;

export enum Difficulty {
  EASY = 'EASY',
  DIFFICULT = 'DIFFICULT',
  HARD = 'HARD'
}

export interface GameState {
  board: Player[];
  isXNext: boolean;
  winner: Player | 'DRAW';
  difficulty: Difficulty;
  winningLine: number[] | null;
  aiCommentary: string;
  isThinking: boolean;
}

export interface Move {
  index: number;
  score: number;
}
