# Build and Deployment Checklist

This document provides a step-by-step guide to building the embeddable widget and deploying it to Firebase.

### Development & Configuration

- [x] **Initialize Project:** Set up a Vite-powered project with React, TypeScript, and TailwindCSS.
- [x] **Develop UI Components:** Create all necessary React components for the user interface, such as the chat window, buttons, and product display cards.
- [x] **Implement State Machine:** Develop the core application logic within `ProductAdvisor.tsx` to manage the conversational flow and application state.
- [x] **Create Filtering Logic:** Implement the deterministic `filterLogic.ts` to handle the step-by-step filtering questions.
- [x] **Integrate AI Service:** Develop the `geminiService.ts` to communicate with the backend Cloud Function for processing natural language queries.
- [x] **Implement Shadow DOM:** Encapsulate the entire widget in a Shadow DOM within `main.tsx` to ensure perfect style isolation from the host page.
- [x] **Develop Backend Function:** Create the secure Cloud Function (`/functions/src/index.ts`) to handle requests, interact with the Gemini API, and return structured data.
- [x] **Configure Firebase:** Set up a Firebase project and configure `firebase.json` for Hosting. This includes setting the public directory and defining necessary CORS headers to allow the widget to be loaded cross-origin.

### Build, Deployment, and Embedding (Revised Plan)

- [x] **Modify Widget Initialization:** The `src/main.tsx` has been updated to be self-contained. It now programmatically creates its own host `<div>`, appends it to the `document.body`, and renders the widget into it, enabling single-script embedding.

- [x] **Build Locally (User):** You ran the build command on your local machine to generate the static assets.

- [x] **Provide Asset Filenames (User):** You provided the exact filenames for the generated CSS and JavaScript assets from your `dist/assets` directory.

- [x] **Update `test.html` (AI):** I updated the `test.html` file with the correct asset URLs you provided.

- [x] **Deploy to Firebase Hosting (User):** You deployed the contents of your local `dist` directory to Firebase Hosting.

- [x] **Verify Deployment:** I used `curl` to verify that the files are live at the correct URLs after your deployment.

- [ ] **Test the Widget:** Once verified, you can open the `test.html` file in your browser to confirm the widget loads and functions correctly.

- [ ] **Deploy the Backend (As Needed):** Deploy the Cloud Function to Firebase if any changes were made to the backend logic.

  ```bash
  firebase deploy --only functions
  ```
