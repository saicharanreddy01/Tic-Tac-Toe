
export const INITIAL_BOARD = Array(9).fill(null);

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const SYSTEM_PROMPT = `You are a polite and helpful AI playing Tic-Tac-Toe against a human. 
The human is 'X' and you are 'O'. 
Provide very short, friendly comments about the game state (max 10 words).`;
