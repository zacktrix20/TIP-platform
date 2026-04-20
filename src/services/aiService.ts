import { GoogleGenAI } from "@google/genai";

// Initialization - platform provides process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function enrichIndicator(indicator: any) {
  if (!process.env.GEMINI_API_KEY) {
      return "Error: GEMINI_API_KEY not configured.";
  }

  try {
    const prompt = `Analyze this normalized threat indicator: ${indicator.value} (${indicator.type}). 
    Description: ${indicator.description}. 
    Provide a brief technical insight (1-2 sentences) about the potential impact and a one-step mitigation recommendation. 
    Keep it professional and concise.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || 'No analysis available.';
  } catch (error: any) {
    console.error("Enrichment Error:", error);
    return `Analysis unavailable: ${error.message || "AI subsystem error"}`;
  }
}

export async function* sendMessageStream(history: ChatMessage[], message: string) {
  if (!process.env.GEMINI_API_KEY) {
      yield { text: "Error: GEMINI_API_KEY not configured. Please set it in Settings." };
      return;
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history as any,
    });

    // Note: If systemInstruction is needed for chat, it's often best handled 
    // by prepending it to the history or using a model that supports it in generateContent.
    // Following the skill's example exactly for chat initialization.
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      if (chunk.text) {
          yield { text: chunk.text };
      }
    }
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    yield { text: `Error: ${error.message || "Failed to connect to AI subsystem."}` };
  }
}
