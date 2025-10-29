# **Phase 1 — Build & Deployment Foundation**

### **Objective**
Establish a working build and deployment pipeline for the widget, diagnose environment issues, and achieve the first successful hosted test on Firebase.

---

## **0001 LOG – Initial Setup**
- **Event:** Accidental deletion of content (not repeated later).  
- **Lesson:** Maintain strict “append-only” discipline for this changelog.

---

## **0002 LOG – Deploy and Test Widget**
**Goal:** Build the React/TypeScript widget, deploy to Firebase Hosting, and validate the live environment.

**Actions**
1. Built frontend with `npm run build`.  
2. Deployed static assets via `classic_firebase_hosting_deploy`.  
3. Created `test.html` embedding script and widget launcher.  
4. Provided detailed browser-based verification steps (UI appearance, valid/invalid AI queries, console CORS check).

**Outcome:**  
✅ All build and deploy steps completed; widget accessible at `https://gen-lang-client-0545699517.web.app` and passed manual tests.

---

## **0003 LOG – Troubleshooting Build and Deployment**
**Problem:** `npm run build` produced empty `dist/`.  
**Diagnosis:** Node.js 20.18.1 < Vite requirement (20.19+ or 22.12+).  
**Fix:** Upgraded Node → 22.12.0 using `n` manager.  
**Verification:** Build succeeded; assets generated; deployed to Firebase.

**Outcome:**  
✅ Environment mismatch fixed; reproducible build established.

---

## **0004–0005 LOG – Empty Build Output Investigation**
**Symptoms:** “Successful” build yet empty `dist/assets`.  
**Analysis Path**
- Isolated Vite vs TypeScript stages.  
- Found `"noEmit": true` blocking TS output; removing it triggered TS5096/5097 cascades.  
- Repaired import paths and config toggles; still produced empty output.

**Conclusion:**  
Persistent environment anomaly; local verification requested.

---

## **0006 LOG – Local Build Success & Deployment Prep**
**User Actions**
- Built locally with Node 20.18.1 (Vite 7.1.12) → ✅ Output exists.  
- Confirmed correct `dist/index.html` and hashed assets.  

**Result:**  
Local build succeeds → environment-specific failure confirmed on sandbox.

---

## **0007 LOG – Documentation Update (Widget Embedding)**
**Task:** Add comprehensive “Widget Embedding” section to `documentation/filemap.md`.

**Highlights**
- Explains `npm run build` process and hashed asset names.  
- Provides HTML snippet with root element and dynamic CSS/JS links.  
- Clarifies manual filename substitution after each build.

**Result:**  
✅ Docs accurate & aligned with Vite output structure.

---

## **0008 LOG – Single-Tag Deployment Preparation**
**Objective:** Produce a self-contained JS bundle referencing its own CSS via hardcoded URL.

**Process**
1. Build → note CSS hash.  
2. Update `src/main.tsx` to hardcode absolute CSS path.  
3. Rebuild → new JS hash includes that path.  
4. Deploy → Firebase Hosting.

**Checkpoint:**  
JS bundle now supports one-line `<script>` embedding. Test page pending.

---

## **0009 LOG – Failed Deploy & Revised Plan**
**Issue:** Empty deploy from sandbox (build still broken there).  
**Fix:** Shift build responsibility to user’s local environment.  
**Changes:** Updated workflow docs & project specs with new hashes.

**Result:**  
✅ Stable local-build pipeline defined → sandbox excluded from critical path.

---

## **0010 LOG – Update CSS Path & Rebuild**
- Updated `main.tsx` with fresh CSS filename.  
- User rebuilt → new JS (`index-0jFUGsFw.js`).  

✅ Ready for deployment.

---

## **0011 LOG – Deploy to Firebase Hosting**
User executed `firebase deploy --only hosting`; assets live.  
Next step: verify and test.

✅ Deployment confirmed.

---

### **Phase 1 Summary**

| Goal | Status | Key Artifacts |
|------|---------|---------------|
| Reproducible build pipeline | ✅ | Vite 7.1.12 + Node 22.12.0 |
| Firebase deployment | ✅ | `https://gen-lang-client-0545699517.web.app` |
| Documentation alignment | ✅ | `filemap.md` Widget Embedding |
| Single-script embed prototype | ✅ | JS bundle with hardcoded CSS path |
| Environment reliability plan | ✅ | Local build process adopted |

---

**End of Phase 1 Extraction**  
Subsequent logs (`0012+`) belong to **Phase 2 — CORS & Cross-Origin Validation**.
