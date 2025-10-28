# PHASE 4: ENVIRONMENT VARIABLE INTEGRATION
- A brief summary of the phase's goal and expected outcome.

## 4.1 GOAL: Integrate Environment Variables to Fix API Key Error
- summary: This phase will resolve the `VITE_WIDGET_API_KEY loaded as: undefined` error. We will create a `.env` file to securely store the API URL and Key, ensure it's ignored by Git, and then rebuild and redeploy the widget so that the final production script has the correct values "baked in."

### 4.1.1 STEP: Create and Populate `.env` File
- summary: I will create a `.env` file in the project's root directory and populate it with the `VITE_API_URL` and `VITE_WIDGET_API_KEY` variables provided by the user.

### 4.1.2 STEP: Update `.gitignore`
- summary: I will add the `.env` file to the `.gitignore` file to ensure that these secret keys are not committed to the Git repository. This is a critical security measure.

## 4.2 GOAL: Rebuild and Redeploy with Injected Variables
- summary: With the environment variables configured, we need to restart the local server for testing and then run a new production build. This will create a new version of the widget's JavaScript file with the API key and URL statically included.

### 4.2.1 STEP: Restart Local Dev Server
- summary: The user will stop and restart the Vite development server (`npm run dev`). This is a mandatory step for Vite to load the new variables from the `.env` file for local testing.

### 4.2.2 STEP: Final Build and Deploy
- summary: Once local testing confirms the fix, the user will run `npm run build` to create a new production-ready script with the environment variables included. They will then deploy this new build to Firebase Hosting using `firebase deploy --only hosting`.
