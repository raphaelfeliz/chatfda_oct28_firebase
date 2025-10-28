# 2 PHASE CORS
- This phase will resolve the Cross-Origin Resource Sharing (CORS) error that prevents the widget from loading on external pages. The fix involves updating the Firebase Hosting configuration to include the necessary `Access-Control-Allow-Origin` header, deploying the change, and verifying the result.

## 2.1 GOAL: Configure Firebase Hosting for Cross-Origin Sharing
- summary: The current hosting configuration is too restrictive and does not allow the widget's assets (JavaScript and CSS) to be loaded from other domains, including a local `test.html` file. We will modify `firebase.json` to explicitly allow requests from any origin.

### 2.1.1 STEP: Inspect `firebase.json`
- summary: I will read the current `firebase.json` file to confirm that it lacks a `"headers"` configuration section. This will verify the root cause of the CORS error.

### 2.1.2 STEP: Add CORS Headers to `firebase.json`
- summary: I will add a `headers` array to the `hosting` configuration in `firebase.json`. This new section will be configured to add the `Access-Control-Allow-Origin: *` header to all file responses, signaling to browsers that the assets are safe to load from any domain.

## 2.2 GOAL: Deploy and Verify the CORS Fix
- summary: After the configuration file is updated, the changes must be deployed to the live server. We will then verify that the fix is working by inspecting the live server's response headers before conducting a final end-to-end test.

### 2.2.1 STEP: Deploy Hosting Configuration
- summary: The user will run the command `firebase deploy --only hosting` to apply the updated `firebase.json` configuration to the live environment.

### 2.2.2 STEP: Verify Header Deployment
- summary: After the user deploys the changes, I will use `curl --head` to inspect the response headers of the live JavaScript asset. This will provide definitive proof that the `Access-Control-Allow-Origin: *` header is present and being served correctly.

### 2.2.3 STEP: Final Test
- summary: Once the header is verified, the user will open the local `test.html` file in their browser to confirm that the widget now loads and functions correctly without any CORS errors.
