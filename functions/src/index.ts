/*
FILE PATH: C:\dev\aiStudio\widget_prototype_V2.1\widget_poc_v3\functions\src\index.ts
PURPOSE: Main entry point for Firebase Cloud Functions.
SUMMARY:
- Imports 'getAIResponseAndFacets' from our logic file.
- Handles POST requests by parsing the body, calling the AI logic,
  and returning the structured JSON response.
IMPORTS:
- {onRequest} from "firebase-functions/v2/https"
- * as logger from "firebase-functions/logger"
- cors = require("cors")
- {getAIResponseAndFacets} from "./geminiLogic"
EXPORTS:
- getAIResponse (Cloud Function)
CHANGE HISTORY:
- 2025-10-23: Initial creation.
- ... (previous fixes) ...
- 2025-10-23: (FIX) Applied all ESLint style fixes (spacing, eol).
- 2025-10-23: (MOD) Integrated 'getAIResponseAndFacets' logic into POST handler.
*/

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";

// NEW: Import the AI "brain"
import {getAIResponseAndFacets} from "./geminiLogic";

// Initialize CORS middleware
const corsHandler = cors({origin: true});

/**
 * HTTPS Cloud Function to handle generative AI requests from the widget.
 */
export const getAIResponse = onRequest(
  {
    region: "us-central1", // Specify region
    secrets: ["API_KEY"], // Load our secret
  },
  (request, response) => {
    // Handle CORS
    corsHandler(request, response, async () => {
      try {
        if (request.method === "POST") {
          // --- 2. Handle POST Request ---
          logger.info("Processing POST request...");

          // NEW: Parse request body from the front-end
          const {userInput, availableFacets, filteredProducts} = request.body;

          // NEW: Add validation
          if (!userInput || !availableFacets || !filteredProducts) {
            logger.warn("Missing required fields in request body.", request.body);
            response.status(400).json({
              error: "Bad Request: Missing required fields.",
            });
            return;
          }

          // NEW: Call the real AI logic
          const aiResponse = await getAIResponseAndFacets(
            userInput,
            availableFacets,
            filteredProducts,
          );

          // NEW: Send the real AI response back
          response.status(200).json(aiResponse);
        } else if (request.method === "OPTIONS") {
          // --- 3. Handle OPTIONS (Preflight) ---
          logger.info("Handling OPTIONS preflight request...");
          response.status(204).send(); // No content
        } else {
          // --- 4. Handle other methods ---
          logger.warn("Unsupported method:", request.method);
          response.status(405).send("Method Not Allowed");
        }
      } catch (error) {
        logger.error("Internal error:", error);
        if (error instanceof Error) {
          response.status(500).json({error: error.message});
        } else {
          response.status(500).json({error: "Internal Server Error"});
        }
      }
    });
  },
);
