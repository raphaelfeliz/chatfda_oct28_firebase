/*
# FILE PATH:
C:\dev\aiStudio\widget_prototype_V2.1\widget_poc_v3\src\services\geminiService.ts
# PURPOSE
This service acts as a "smart adapter" between the React app and the
decoupled Gemini Cloud Function. It performs:
1. Prompt Engineering: Builds a complex prompt to ask the AI for the
   specific JSON structure the app needs (including extractedFacets).
2. API Call: Calls the live API, passing the secure key.
3. Dynamic Response Handling: Safely checks the response Content-Type
   and returns either the full JSON object (happy path) or a
   fallback text-only object (fallback path).
# CHANGE LOG:
- 2025-10-24: (FIX) Replaced entire mock service with live "smart adapter" logic.
- 2025-10-24: (FIX) Removed unused 'MessageSender' value import.
- 2025-10-24: Applied VSCode cleanup (input sanitization, runtime validation).
- 2025-10-24: (REVERT BREAKING CHANGE) Re-enabled Authorization header required by our specific Cloud Function.
- 2025-10-28: Added detailed logging around fetch call for debugging.
*/

// Import types needed from the v4.0 project (only Facet and Product now)
import type {
  Facet,
  Product,
} from '../types';

// Local runtime interface for the adapter response.
// Kept local to avoid coupling the front-end types with a runtime validation dependency.
// MUST be kept in sync with the structure expected by ProductAdvisor.tsx
export interface AIExtractionResponse {
  knowledgeBaseAnswer: string;
  // Use Record<string, string | null> to allow null values from AI
  extractedFacets: Record<string, string | null>;
  talkToHuman: boolean;
  humanHandoffMessage: string;
}

// Get API credentials from .env file
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_WIDGET_API_KEY; // Read the key for the header
console.log("DEBUG: VITE_WIDGET_API_KEY loaded as:", API_KEY);

// Define the exact JSON structure we need the AI to return
// This MUST match the AIExtractionResponse type
const JSON_RESPONSE_FORMAT = `{
  "knowledgeBaseAnswer": "A string containing a helpful answer to the user's question, or an empty string if no specific question was asked.",
  "extractedFacets": {
    "categoria": "janela | porta | null",
    "sistema": "abrir | correr | null",
    "persiana": "com | sem | null",
    "persianaMotorizada": "sim | nao | null",
    "material": "aluminio | pvc | null",
    "cor": "branca | preta | null",
    "folhasNumber": "2 | 3 | 4 | 6 | null",
    "largura": "1.0-1.2 | 1.2-1.4 | ... | null"
  },
  "talkToHuman": "boolean (true if the user seems frustrated or asks to speak to a person)",
  "humanHandoffMessage": "A string with a polite handoff message if talkToHuman is true, otherwise an empty string."
}`;

/**
 * Builds the engineered prompt to send to the AI.
 */
const buildPrompt = (
  userInput: string,
  availableFacets: Facet[],
  filteredProducts: Product[]
): string => {
  // 1. Create context strings
  // Sanitize user input to avoid breaking the prompt formatting
  const safeUserInput = userInput.replace(/`/g, "'").replace(/\r?\n/g, ' ');

  const availableFacetList = availableFacets
    .map((f) => f.attribute)
    .join(', ');
  const productCount = filteredProducts.length;

  // 2. Build the final prompt
  return `
    CONTEXT:
    You are an AI sales assistant for an aluminum window and door company.
    The user is currently looking at a list of ${productCount} products.
    The user is asking: "${safeUserInput}"
    The remaining available filters (facets) are: [${availableFacetList}].

    YOUR TASK:
    Analyze the user's message and respond ONLY with a valid JSON object
    that follows this exact structure:
    ${JSON_RESPONSE_FORMAT}

    RULES:
    1.  knowledgeBaseAnswer: Answer the user's question based on the context. If no specific question is asked, this should be an empty string.
    2.  extractedFacets: Analyze the user's message ("${safeUserInput}") and
        extract values *only* for the available facets: [${availableFacetList}].
    3.  If a user's preference is unclear for an available facet, set its value to null.
    4.  If the user asks to talk to a person, set talkToHuman to true.
    5.  Respond *only* with the raw JSON object. Do not wrap it in Markdown (no code fences).
  `;
};

// Lightweight runtime validator for the AI response shape.
const isValidAIExtractionResponse = (obj: unknown): obj is AIExtractionResponse => {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.knowledgeBaseAnswer === 'string' &&
    typeof o.talkToHuman === 'boolean' &&
    typeof o.humanHandoffMessage === 'string' &&
    o.extractedFacets !== undefined && typeof o.extractedFacets === 'object' && o.extractedFacets !== null
    // We trust the structure inside extractedFacets for now
  );
};

/**
 * Calls the live Gemini Cloud Function, engineers a prompt to get structured JSON,
 * and safely parses the dynamic response.
 */
export const getAIResponseAndFacets = async (
  message: string,
  availableFacets: Facet[],
  filteredProducts: Product[]
): Promise<AIExtractionResponse> => {

  // 1. Create the advanced prompt
  const engineeredPrompt = buildPrompt(
    message,
    availableFacets,
    filteredProducts
  );

  // 2. Define the fallback response in case of a network error
  const networkErrorResponse: AIExtractionResponse = {
    knowledgeBaseAnswer:
      'Desculpe, não consegui me conectar ao assistente. Tente novamente mais tarde.',
    extractedFacets: {},
    talkToHuman: false,
    humanHandoffMessage: '',
  };

  // 3. Define the fallback response for a plain text (non-JSON) reply
  const fallbackResponse = (text: string): AIExtractionResponse => ({
    knowledgeBaseAnswer: text,
    extractedFacets: {},
    talkToHuman: false,
    humanHandoffMessage: '',
  });


  try {
    // 4. Call the live Cloud Function API
    if (!API_URL || !API_KEY) {
      console.error('Missing VITE_API_URL or VITE_WIDGET_API_KEY in .env file');
      return networkErrorResponse;
    }

    const requestBody = { prompt: engineeredPrompt };
    // --- ADDED LOG ---
    console.log(`DEBUG: Sending request to ${API_URL}`);
    console.log(`DEBUG: Request Body:`, JSON.stringify(requestBody, null, 2)); // Log formatted JSON
    // ---------------

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // --- REVERTED BREAKING CHANGE ---
        // This header IS required by our specific Cloud Function's security setup.
        // VSCode's warning is correct for public APIs, but not applicable here.
        Authorization: `Bearer ${API_KEY}`,
        // --- END REVERT ---
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      // Log the body for debugging if needed
      // const errorBody = await response.text();
      // console.error('Error Body:', errorBody);
      return networkErrorResponse;
    }

    // 5. Read the response as text and try to parse JSON safely.
    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';

    // --- ADDED LOG ---
    console.log(`DEBUG: Received response with Content-Type: ${contentType}`);
    console.log(`DEBUG: Raw Response Body:`, text);
    // ---------------

    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(text);
        // Validate the structure matches what ProductAdvisor expects
        if (isValidAIExtractionResponse(parsed)) {
          return parsed; // Happy path!
        }
        // Log if structure is wrong, but still return text fallback
        console.warn('AI returned JSON but it did not match expected shape:', parsed);
        return fallbackResponse(text); // Return raw text if shape is wrong
      } catch (e) {
        // Log if JSON parsing fails even with correct header
        console.warn('Failed to parse JSON even though Content-Type was application/json:', e);
        return fallbackResponse(text); // Return raw text if parsing fails
      }
    }

    // Not JSON -> return text fallback
    return fallbackResponse(text);
  } catch (error) {
    console.error('Fetch failed:', error);
    return networkErrorResponse;
  }
};