import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global styles for inside the shadow DOM
import App from './App'; // Your main app wrapper

// --- NEW: Wait for the DOM to be ready before doing anything ---
document.addEventListener('DOMContentLoaded', () => {
  // --- DEBUG LOG ---
  console.log('[Widget] DOM fully loaded and parsed, initializing widget...');

  try { // Add a try...catch around initialization for safety
    // --- Step 1: Create the Host Element ---
    const widgetHost = document.createElement('div');
    widgetHost.id = 'chat-widget-host'; // Unique ID for the host
    // --- DEBUG LOG ---
    console.log('[Widget] Created host element:', widgetHost);

    // --- Step 1b: Style the Host Element ---
    // Make the HOST itself fixed to the viewport edges
    widgetHost.style.position = 'fixed';
    widgetHost.style.top = '0';
    widgetHost.style.right = '0';
    widgetHost.style.bottom = '0';
    // Constrain the width like the CSS media query did
    widgetHost.style.width = '100%';
    widgetHost.style.maxWidth = '64rem';
    // Use a very high z-index to ensure it's on top
    widgetHost.style.zIndex = '2147483647';
    // Ensure it's visible (React components inside will handle toggling)
    widgetHost.style.display = 'block';
    // Add pointer events control so clicks go *through* the host if needed
    // This allows clicking on the page behind the host *until* the widget opens.
    // Your React component (.chat-window) should set pointer-events: auto;
    widgetHost.style.pointerEvents = 'none'; // Clicks pass through host initially

    // --- Step 1c: Append Host to Body ---
    // Check if body exists before appending (extra safety)
    if (document.body) {
        document.body.appendChild(widgetHost);
        // --- DEBUG LOG ---
        console.log('[Widget] Host element appended to body.');
    } else {
        // --- DEBUG LOG ---
        console.error('[Widget] FATAL: document.body not found at time of append!');
        return; // Stop initialization if body isn't ready
    }

    // --- Step 2: Attach the Shadow Root ---
    const shadowRoot = widgetHost.attachShadow({ mode: 'open' }); // 'open' for inspectability
    // --- DEBUG LOG ---
    console.log('[Widget] Shadow root attached successfully.');

    // --- Step 3: Create Mount Point Inside Shadow DOM ---
    const appRoot = document.createElement('div');
    appRoot.id = 'shadow-root-react-mount-point'; // ID for React's createRoot
    appRoot.style.height = '100%'; // Make internal root fill the host
    shadowRoot.appendChild(appRoot);
    // --- DEBUG LOG ---
    console.log('[Widget] React mount point created inside shadow root.');

    // --- Step 4: Link CSS Inside Shadow DOM ---
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    // --- !!! IMPORTANT: USE THE ABSOLUTE URL NOW !!! ---
    // This MUST be replaced with the CSS filename from the `dist/assets` folder after each build.
    styleLink.href = 'https://gen-lang-client-0545699517.web.app/assets/index-DN-9DjmB.css'; // <-- UPDATED
    // --- DEBUG LOG & BUILD REMINDER ---
    console.warn(
      `[Widget] Loading CSS: ${styleLink.href}. ` +
      `REMINDER: If CSS fails (404), rebuild following the 'Build -> Update -> Rebuild' sequence.`
    );
    // --- END DEBUG LOG & REMINDER ---
    shadowRoot.appendChild(styleLink);
    // --- DEBUG LOG ---
    console.log('[Widget] CSS linked inside shadow root:', styleLink.href);

    // --- Step 5: Render React App ---
    const root = createRoot(appRoot); // Target the div INSIDE the shadow root
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    // --- DEBUG LOG ---
    console.log('[Widget] React app rendering initiated.');

  } catch (error) {
    // --- DEBUG LOG ---
    console.error("[Widget] CRITICAL ERROR during initialization:", error);
    // Optionally, you could try to remove the host element if setup fails
    const host = document.getElementById('chat-widget-host');
    if (host) {
        host.remove();
        console.log('[Widget] Removed host element due to error.');
    }
  }
}); // --- End DOMContentLoaded listener ---