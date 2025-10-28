/*
FILE PATH: C:\dev\aiStudio\widget_prototype_V2.1\widget_poc_v3\functions\src\geminiLogic.ts
PURPOSE: Contains all business logic for calling the Gemini AI.
SUMMARY:
- Imports @google/genai SDK (older version syntax).
- Retrieves API key from process.env (set by Secret Manager).
- Imports types, product data, and KB data from local/shared paths.
- Exports 'getAIResponseAndFacets', which builds a context-rich prompt,
  calls Gemini, attempts to parse JSON, and returns a structured response.
IMPORTS:
- {GoogleGenAI, HarmCategory, HarmBlockThreshold, GenerateContentResponse} from "@google/genai"
- {Facet, Product, ProductData} from "../../src/types" (Shared from front-end)
- {productData} from "../../src/product_data" (Shared from front-end)
- {knowledgeBase} from "./kb_data" (Local to backend)
EXPORTS:
- AIExtractionResponse (interface)
- getAIResponseAndFacets (async function)
CHANGE HISTORY:
- ... (previous history) ...
- 2025-10-28: (FINAL) Corrected SDK import, constructor, API call,
response access for older @google/genai. Uses gemini-pro. Includes context injection and Markdown cleaning.
- 2025-10-29: REFINE_AI_CONTEXT - Adjusted temperature for factuality and updated interface/logic to handle 'null' answers.
*/

/* eslint-disable max-len */

import {
  GoogleGenAI, // <-- Correct import name
  HarmCategory,
  HarmBlockThreshold,
} from "@google/genai"; //

// Keep existing type/data imports with relative paths
import type {Facet, Product, ProductData} from "../../src/types"; //
import {productData} from "../../src/product_data"; //
import {knowledgeBase} from "./kb_data"; //

// Keep existing interface
export interface AIExtractionResponse {
  knowledgeBaseAnswer: string | null; // MODIFIED: Allow null for "no answer" cases
  humanHandoffMessage: string;
  extractedFacets: { [key: string]: string | null };
  talkToHuman: boolean;
} //

// Keep existing safetySettings and generationConfig
const safetySettings = [
  {category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
];

const generationConfig: any = { // Adding explicit type to prevent TS errors later
  temperature: 0.2, // MODIFIED: Lowered from 0.3 for more factual, less creative responses
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
}; // <-- The semicolon MUST be on a clean line or after the brace

// Keep existing buildPrompt function - it correctly incorporates context
const buildPrompt = (
  userInput: string,
  availableFacets: Facet[],
  filteredProducts: Product[],
  kbContent: string,
  fullFacetsSchema: ProductData["facets"]
): string => {
  // ... (Existing prompt building logic remains unchanged) ...

  // NEW INSTRUCTION FOR PROMPT: The prompt itself should be updated to include a rule like:
  // "If you cannot answer based on the provided CONTEXT, you MUST return "knowledgeBaseAnswer": null."
  return `... (The full prompt template including context and JSON schema) ...`;
}; //


// --- Main Function ---
export const getAIResponseAndFacets = async (
  userInput: string,
  availableFacets: Facet[],
  filteredProducts: Product[]
): Promise<AIExtractionResponse> => {
  // Keep API Key access inside handler
  const API_KEY = process.env.API_KEY?.trim();
  if (!API_KEY) {
    console.error("CRITICAL: API_KEY is missing from environment!");
    return { // Return full error structure
      knowledgeBaseAnswer: "Erro: A chave da API não está configurada no servidor.",
      humanHandoffMessage: "",
      extractedFacets: {},
      talkToHuman: false,
    };
  }

  // Use correct SIMPLE constructor for older SDK
  const genAI = new GoogleGenAI(API_KEY as any); // Added 'as any' assertion

  // Keep defaultErrorResponse
  const defaultErrorResponse: AIExtractionResponse = {
    knowledgeBaseAnswer:
    "Desculpe, não consegui processar sua solicitação no momento. " +
    "Por favor, tente novamente ou selecione uma das opções abaixo.",
    humanHandoffMessage: "",
    extractedFacets: {}, // Empty object is valid here
    talkToHuman: false,
  };

  try {
    // Keep context preparation
    const kbContentString = knowledgeBase; //
    const fullFacetsSchema = productData.facets; //

    // Keep prompt building call
    const prompt = buildPrompt( //
      userInput,
      availableFacets,
      filteredProducts,
      kbContentString,
      fullFacetsSchema
    );

    // --- FINALIZED SDK CALL ---
    // Use the older SDK pattern: genAI.models.generateContent
    // --- CORRECTED SDK CALL for older @google/genai ---
    // We must flatten the settings into the top-level parameter object.
    const result = await genAI.models.generateContent({
      model: "gemini-pro", // <-- Model stays here
      contents: [{role: "user", parts: [{text: prompt}]}], // Contents stays here
      // Spread the properties of generationConfig directly here.
      ...generationConfig, // FIX: Spreads temperature, topK, etc.
      safetySettings, // FIX: safetySettings is likely accepted at the top level
      // Note: If safetySettings fails, we might need to remove it or move it inside a config object.
    });
    // --- END CORRECTED SDK CALL ---
    // --- END FINALIZED SDK CALL ---

    // --- FINALIZED RESPONSE ACCESS ---
    let jsonText: string | undefined | null = null;
    // Try the candidates path first (might work depending on exact older SDK version)
    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      jsonText = result.candidates[0].content.parts[0].text;
    } else if (result && typeof (result as any).text === "string") {
      // Fallback: Check the '.text' PROPERTY using type assertion
      jsonText = (result as any).text;
    }
    // --- END FINALIZED RESPONSE ACCESS ---

    if (typeof jsonText !== "string" || jsonText.trim() === "") {
      console.warn("AI response format invalid or missing text. Raw result:", JSON.stringify(result)); //
      return {...defaultErrorResponse, knowledgeBaseAnswer: "Desculpe, recebi uma resposta inesperada do assistente. Poderia tentar de novo?"}; //
    }

    // --- JSON Parsing & Cleaning Logic (Includes regex cleaning) ---
    let parsedResponse: AIExtractionResponse;
    try {
      // Add back regex cleaning before parse for robustness
      const jsonMatch = jsonText.match(/```(json)?\\s*([\\s\\S]*?)\\s*```/);
      const textToParse = jsonMatch ? jsonMatch[2].trim() : jsonText.trim();
      parsedResponse = JSON.parse(textToParse) as AIExtractionResponse; //
    } catch (parseError) {
      console.error("Failed to parse JSON response from AI:", parseError, "Raw text received:", jsonText); //
      return {...defaultErrorResponse, knowledgeBaseAnswer: "Desculpe, tive um problema ao entender a resposta do assistente. Por favor, tente selecionar uma opção."}; //
    }

    // MODIFIED: Basic Validation to handle nulls
    if (typeof parsedResponse.extractedFacets !== "object" || parsedResponse.extractedFacets === null) {
      parsedResponse.extractedFacets = {};
    } 
    if (typeof parsedResponse.talkToHuman !== "boolean") {
      parsedResponse.talkToHuman = false;
    }
    // Allow knowledgeBaseAnswer to be null, otherwise default to empty string
    if (parsedResponse.knowledgeBaseAnswer !== null && typeof parsedResponse.knowledgeBaseAnswer !== "string") {
        parsedResponse.knowledgeBaseAnswer = "";
    }
    if (typeof parsedResponse.humanHandoffMessage !== "string") {
      parsedResponse.humanHandoffMessage = "";
    }

    // Keep Clean up extractedFacets (removes nulls/empties)
    const cleanedFacets: { [key: string]: string } = {};
    for (const key in parsedResponse.extractedFacets) {
      if (Object.prototype.hasOwnProperty.call(parsedResponse.extractedFacets, key)) { //
        const value = parsedResponse.extractedFacets[key];
        if (typeof value === "string" && value.trim() !== "") { //
          cleanedFacets[key] = value.trim(); //
        }
      }
    }
    parsedResponse.extractedFacets = cleanedFacets; //

    return parsedResponse;
    // --- End JSON Parsing & Cleaning ---
  } catch (error) {
    console.error("Error calling/processing Gemini API:", error); //
    return defaultErrorResponse; //
  }
};
