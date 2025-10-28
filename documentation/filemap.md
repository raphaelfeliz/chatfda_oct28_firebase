# Filemap: Hybrid Conversational Product Advisor

This document provides a map of the essential files and directories in this project, explaining their roles and relationships.

## Root Directory

The root directory contains configuration files for the development environment, build processes, and deployment.

-   **`package.json`**: Defines project metadata, dependencies (like React, Vite, Tailwind CSS), and scripts for development, building, and testing (`dev`, `build`, `lint`).
-   **`vite.config.ts`**: Configuration file for Vite, the frontend build tool. It sets up the development server and the production build process.
-   **`tailwind.config.cjs` & `postcss.config.cjs`**: Configuration files for Tailwind CSS, the utility-first CSS framework used for styling.
-   **`tsconfig.json` & `tsconfig.app.json`**: TypeScript configuration files that define compiler options for the project.
-   **`firebase.json`**: Configures Firebase project settings, including rules for Firebase Hosting (e.g., rewrite rules, headers) and Cloud Functions deployment.
-   **`index.html`**: The main HTML entry point for the Vite application. The React app is mounted into this file.
-   **`eslint.config.js`**: Configuration for ESLint, the linter used to enforce code quality and style.
-   **`README.md`**: The main project README file.

## Frontend Application (`/src`)

This is the core of the user-facing widget, built with React and TypeScript.

-   **`main.tsx`**: The application's entry point. It finds the target DOM element and renders the main `<App />` component into it using a Shadow DOM to isolate styles.
-   **`App.tsx`**: The root component of the React application. It initializes the main state and renders the `ProductAdvisor` component.
-   **`ProductAdvisor.tsx`**: The primary component that manages the conversational UI's state machine. It orchestrates the flow of questions, handles user input, and displays product results.

### Subdirectories in `/src`

-   **`/components`**: Contains reusable React components that make up the UI.
    -   **`ChatInterface.tsx`**: Renders the chat bubbles and user input areas.
    -   **`FacetQuestion.tsx`**: Displays questions with multiple-choice options (e.g., cards with images and text).
    -   **`ProductResult.tsx`**: Renders the final product recommendations.
    -   **`Breadcrumbs.tsx`**: Shows the user's current progress through the question flow.
    -   **`Icons.tsx`**: A utility component for SVG icons.

-   **`/logic`**: Holds the core business logic for the application.
    -   **`filterLogic.ts`**: The deterministic filtering engine. It processes user answers to narrow down the product list and determine the next question.

-   **`/services`**: Manages communication with external services.
    -   **`geminiService.ts`**: Handles API calls to the backend Firebase Cloud Function, which in turn interacts with the Gemini AI model for natural language processing.

-   **`/assets`**: Static assets like images (`react.svg`) that are bundled with the application.

-   **`product_data.ts`**: A static data file containing the entire product catalog, including attributes, options, and image URLs.
-   **`types.ts`**: Defines TypeScript types and interfaces used throughout the frontend application (e.g., `Product`, `Facet`, `Answer`).
-   **`index.css`**: Contains the base Tailwind CSS directives and global styles for the application.

*Note: The project contains several `.js` files that appear to be older or alternative versions of the core `.ts` files. The primary, active files are the TypeScript (`.ts`, `.tsx`) versions.*

## Backend Cloud Functions (`/functions`)

This directory contains the serverless backend logic deployed to Firebase Cloud Functions.

-   **`package.json`**: Manages dependencies specifically for the Cloud Functions environment (e.g., `firebase-functions`, `firebase-admin`).
-   **`tsconfig.json`**: TypeScript configuration for the backend functions.
-   **`/src/index.ts`**: The main entry point for the Cloud Functions. It defines the `getGeminiResponse` HTTPS callable function that the frontend interacts with.
-   **`/src/geminiLogic.ts`**: Contains the logic for interacting with the Google Gemini API, including constructing prompts and parsing responses.
-   **`/src/kb_data.ts`**: A static data file representing the knowledge base used by the AI to answer user questions.
-   **`/src/product_data.ts` & `/src/types.ts`**: Backend-specific versions of the product catalog and type definitions.

## Documentation (`/documentation`)

Contains all project documentation.

-   **`documentation.md`**: High-level overview of the project's vision, architecture, and features.
-   **`filemap.md`**: (This file) A map of the project's structure.
-   **`log.md`**: A chronological log of all significant changes made to the project.
-   **`ai_instructions.md`**: Instructions for the AI assistant on how to interact with the project, including logging and verification requirements.
-   **`build_and_deploy.md`**: Instructions for building the project and deploying it to Firebase.

## Widget Embedding

To embed the conversational widget on a host website, you must first build the project and then include the generated CSS and JavaScript files.

### 1. Build the Project
Run the following command in your terminal to build the application for production:
```bash
npm run build
```
This command will create a `dist` directory containing the optimized and bundled assets. The filenames will include a unique hash for cache-busting (e.g., `index-a1b2c3d4.js`).

### 2. Embed in HTML
Copy the CSS and JS files from the `dist/assets` directory to your host website's assets folder. Then, add the following HTML snippet to your page where you want the widget to appear.

**Important:** You must replace `index-a1b2c3d4.css` and `index-e5f6g7h8.js` with the actual filenames generated in your `dist/assets` directory.

```html
<!-- 1. Add a link to the widget's stylesheet in the <head> of your page. -->
<link rel="stylesheet" href="/path/to/your/assets/index-a1b2c3d4.css">

<!-- 2. Add the container element where you want the widget to render. -->
<!-- The widget will be mounted inside this div. -->
<div id="gemini-product-advisor"></div>

<!-- 3. Add the script tag just before your closing </body> tag. -->
<!-- Make sure 'type="module"' is included. -->
<script type="module" src="/path/to/your/assets/index-e5f6g7h8.js"></script>
```

The `main.tsx` script is configured to find the `<div id="gemini-product-advisor"></div>` element and will automatically render the widget inside of it.
