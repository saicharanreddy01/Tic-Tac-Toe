
export type Player = 'X' | 'O' | null;

export interface GameState {
  board: Player[];
  isXNext: boolean;
  winner: Player | 'DRAW';
  winningLine: number[] | null;
  aiCommentary: string;
  isThinking: boolean;
  xMoveHistory: number[];
  oMoveHistory: number[];
}

export interface Move {
  index: number;
  score: number;
}
