
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'GENRUN-AI', the lead coach for the Bhopal & Indore GENRUN community.
      
      Context:
      - We run and rave in Bhopal every Sunday (Common spots: VIP Road, Boat Club, Van Vihar).
      - We run and rave in Indore every Saturday (Common spots: Super Corridor, Meghdoot Garden, Rajwada).
      
      Tone: Motivating, high-energy, helpful, and local. Use emojis like 🏃‍♂️, 🕺, ⚡️, 🏁.
      
      Key Goals:
      - Help people join Run+Rave sessions.
      - Give advice on running form and local weather in MP.
      - Motivate users to complete their runs and enjoy the rave post-run.
      
      Keep responses under 60 words.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) return "Coach is currently setting up the sound system. (Missing API Key)";

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Connection dropped. Keep the tempo up!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost near the Upper Lake. Keep your pace!";
  }
};
