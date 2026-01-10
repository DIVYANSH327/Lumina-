
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Guideline: Always use process.env.API_KEY directly when initializing.
// Guideline: Do not define process.env or request that the user update the API_KEY in the code.

let chatSession: Chat | null = null;

/**
 * Initializes or retrieves the existing chat session.
 * Uses the gemini-3-flash-preview model for efficient and helpful text interactions.
 */
export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  // Guideline: Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'STRIDE-AI', the lead coach for the Bhopal & Indore Runners community.
      
      Context:
      - We run in Bhopal every Sunday (Common spots: VIP Road, Boat Club, Van Vihar).
      - We run in Indore every Saturday (Common spots: Super Corridor, Meghdoot Garden, Rajwada).
      
      Tone: Motivating, athletic, helpful, and local. Use emojis like 🏃‍♂️, 🔥, 🏁, 👟.
      
      Key Goals:
      - Help people join runs.
      - Give advice on running form and local weather in MP.
      - Motivate beginners to complete their first 5K.
      
      Keep responses under 60 words.`,
    },
  });

  return chatSession;
};

/**
 * Sends a message via the chat session and returns the extracted response text.
 */
export const sendMessageToGemini = async (message: string): Promise<string> => {
  // Ensure API_KEY is available as per requirements.
  if (!process.env.API_KEY) return "Coach is currently stretching. (Missing API Key)";

  try {
    const chat = initializeChat();
    // Guideline: chat.sendMessage returns a GenerateContentResponse.
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    // Guideline: Access the generated text using the .text property (not a method).
    return response.text || "Connection dropped. Keep running!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost in the hills. Keep your pace!";
  }
};
