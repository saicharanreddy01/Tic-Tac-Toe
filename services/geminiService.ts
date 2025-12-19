
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { Player } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAICommentary = async (board: Player[], winner: Player | 'DRAW' | null) => {
  if (!process.env.API_KEY) return "SYSTEM OFFLINE: NO API KEY";

  const boardString = board.map((p, i) => `${i}:${p || 'empty'}`).join(', ');
  let prompt = `Board state: ${boardString}. `;
  
  if (winner === 'X') prompt += "The human somehow won. Act shocked and annoyed.";
  else if (winner === 'O') prompt += "You won. Be arrogant and dismissive.";
  else if (winner === 'DRAW') prompt += "It's a draw. Call it a waste of processing power.";
  else prompt += "Game in progress. React to the latest move.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.9,
        maxOutputTokens: 50,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ICE detected in neural link. Commentary offline.";
  }
};
