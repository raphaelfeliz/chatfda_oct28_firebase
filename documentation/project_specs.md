# Project Specifications Cheat Sheet

This document serves as a quick reference for key project configurations and details.

## Core Technologies:
- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Google Cloud Functions (TypeScript)
- **Hosting:** Firebase Hosting
- **AI Integration:** Google Gemini API
- **Encapsulation:** Shadow DOM

## Environment Details:
- **Recommended Node.js Version for Development:** 20.19+ or 22.12+
- **Vite Version:** 7.1.12
- **Frontend Build Output Directory:** `dist`

## Firebase Setup
- **Firebase Project ID:** `gen-lang-client-0545699517`
- **Firebase Project Alias:** `fdaChatAIStudio`
- **Hosting URL (Base)::** `https://gen-lang-client-0545699517.web.app`
- **Enabled Features (`firebase init`):** `Functions`, `Hosting`, `Emulators`
- **Public Directory (for Hosting):** `dist`
- **Functions Language:** `TypeScript`
- **Functions Linter:** `ESLint`
- **Emulators Configured:** `Functions` (Port: 5001), `Hosting` (Port: 5000), `Emulator UI`

## Latest Build Asset Paths (from user's local successful build):
These paths are crucial for embedding the widget in `test.html`.

- **CSS Asset:** `dist/assets/index-DN-9DjmB.css` (Full URL: `https://gen-lang-client-0545699517.web.app/assets/index-DN-9DjmB.css`)
- **JavaScript Asset:** `dist/assets/index-0jFUGsFw.js` (Full URL: `https://gen-lang-client-0545699517.web.app/assets/index-0jFUGsFw.js`)

## Important Files & Folders:
- **Frontend Source:** `src/`
- **Backend Cloud Function Source:** `functions/src/`
- **Main Widget Entry Point (Client-side):** `src/main.tsx` (handles Shadow DOM setup)
- **AI Logic (Backend):** `functions/src/geminiLogic.ts`
- **Product Data:** `src/product_data.ts` (also used by functions/src/product_data.ts)
- **Knowledge Base Data:** `functions/src/kb_data.ts`
- **Firebase Configuration:** `firebase.json`
- **Firebase Project Alias Config:** `.firebaserc`
- **Local Widget Test Page:** `test.html` (requires updating with latest asset hashes after each build)
