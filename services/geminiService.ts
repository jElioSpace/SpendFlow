
import { GoogleGenAI, Type } from "@google/genai";
import { GroceryItem, SmartSuggestion } from "../types";

export const API_KEY_STORAGE_KEY = 'spendflow_gemini_api_key';

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setStoredApiKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearStoredApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

const getAIInstance = () => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("No API key configured. Please set your Gemini API key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getSmartSuggestions = async (currentItems: GroceryItem[]): Promise<SmartSuggestion[]> => {
  if (currentItems.length === 0) return [];

  const itemList = currentItems.map(i => i.name).join(", ");

  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given these grocery items: ${itemList}. Suggest 3 more items I might need. Provide a brief reason why for each.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["name", "reason"]
          }
        }
      }
    });

    // Access the .text property directly
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};

export const autoCategorize = async (itemName: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this grocery item: "${itemName}". Return only the category name (e.g., Produce, Dairy, Bakery, Pantry, Meat, Frozen, Household).`,
      config: {
        maxOutputTokens: 10,
      }
    });
    // Access the .text property directly
    return response.text?.trim() || "Other";
  } catch {
    return "Other";
  }
};
