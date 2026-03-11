
import { GoogleGenAI, Type } from "@google/genai";
import { Concept, QuizQuestion, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async extractConcepts(input: { type: 'pdf' | 'video' | 'text' | 'image', content: string }): Promise<{ summary: string; concepts: Concept[]; extractedText?: string }> {
    let contents: any;

    if (input.type === 'pdf' || input.type === 'image') {
      contents = [
        {
          inlineData: {
            mimeType: input.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
            data: input.content // Base64 string
          }
        },
        {
          text: `Analyze this ${input.type} content. 
          1. Extract all the text from it verbatim or as close as possible (if it's a document).
          2. Extract key concepts.
          3. Provide a concise summary.
          
          Output JSON.`
        }
      ];
    } else {
      contents = `Analyze this ${input.type} content.
      1. Extract key concepts.
      2. Provide a concise summary.
      
      Content: ${input.content.substring(0, 20000)}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: Array.isArray(contents) ? { parts: contents } : contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: { type: Type.STRING, description: "The full extracted text from the document, or a detailed transcript." },
            summary: { type: Type.STRING },
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  connections: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "name", "description", "connections"]
              }
            }
          },
          required: ["summary", "concepts"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return {
      summary: data.summary,
      concepts: data.concepts.map((c: any) => ({ ...c, mastery: 1, status: 'LEARNING' })),
      extractedText: data.extractedText
    };
  },

  async generateQuiz(materialContent: string, difficulty: Difficulty): Promise<QuizQuestion[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 5-question multiple choice quiz based on the following material. Difficulty level: ${difficulty}.
      
      Material: ${materialContent.substring(0, 50000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const questions = JSON.parse(response.text);
    return questions.map((q: any) => ({ ...q, difficulty }));
  },

  async chat(message: string, context: string, history: { role: 'user' | 'assistant'; text: string }[]): Promise<string> {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are an AI Tutor. You have access to the following learning materials:\n\n${context.substring(0, 50000)}\n\nAnswer the user's questions based on these materials. If the answer isn't in the materials, use your general knowledge but mention that it's not explicitly in the provided content. Be helpful, encouraging, and concise.`
      },
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  }
};
