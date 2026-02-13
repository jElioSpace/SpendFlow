
import { GoogleGenAI, Type } from "@google/genai";
import { GroceryItem, SmartSuggestion } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSuggestions = async (currentItems: GroceryItem[]): Promise<SmartSuggestion[]> => {
  if (currentItems.length === 0) return [];

  const itemList = currentItems.map(i => i.name).join(", ");
  
  try {
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
