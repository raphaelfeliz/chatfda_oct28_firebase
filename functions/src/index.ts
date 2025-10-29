
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import express from "express";

import {getAIResponseAndFacets} from "./geminiLogic";

const app = express();

app.use(express.json());

const corsMw = cors({origin: true});
app.use(corsMw);
app.options('*', corsMw);

app.post("/", async (request, response) => {
  try {
    logger.info("Processing POST request...");

    const {userInput, availableFacets, filteredProducts} = request.body;

    if (!userInput || !availableFacets || !filteredProducts) {
      logger.warn("Missing required fields in request body.", request.body);
      response.status(400).json({
        error: "Bad Request: Missing required fields.",
      });
      return;
    }

    const aiResponse = await getAIResponseAndFacets(
      userInput,
      availableFacets,
      filteredProducts,
    );

    response.status(200).json(aiResponse);
  } catch (error) {
    logger.error("Internal error:", error);
    if (error instanceof Error) {
      response.status(500).json({error: error.message});
    } else {
      response.status(500).json({error: "Internal Server Error"});
    }
  }
});

export const getAIResponse = onRequest(
  {
    region: "us-central1",
    secrets: ["API_KEY"], 
  },
  app,
);
