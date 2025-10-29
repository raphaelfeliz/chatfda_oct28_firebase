Here’s your plan reformatted exactly in the concise, structured way you described:

---

## **plan:**

Step-by-step, verifiable recovery of a broken Firebase Hosting deploy and CORS configuration.

---

# **1. Phase: Verify Local Project Context**

* **Summary:** Confirm the project directory actually contains all expected files and is bound to the correct Firebase project.

## **1.1 Check local structure**

* **Summary:** Ensure `firebase.json`, `dist/`, and `.firebaserc` exist.
* **Success evidence:** `ls` shows those files in the project root.

## **1.2 Confirm Firebase CLI + login**

* **Summary:** Verify CLI is installed and authenticated.
* **Command:**

  ```bash
  firebase --version && firebase login:list
  ```
* **Success evidence:** CLI prints version (≥12.x) and your email appears.

## **1.3 Verify or recreate `.firebaserc`**

* **Summary:** If missing, link the folder to your Firebase project.
* **Command:**

  ```bash
  firebase use gen-lang-client-0545699517 --add
  cat .firebaserc
  ```
* **Success evidence:** File contains:

  ```json
  { "projects": { "default": "gen-lang-client-0545699517" } }
  ```

## **1.4 Example checkpoint — real test**

* **Summary:** Confirm you’re truly connected to the intended site.
* **Command:**

  ```bash
  firebase hosting:sites:list
  ```
* **Success evidence:** The table includes `gen-lang-client-0545699517`.

---

# **2. Phase: Confirm Deployable Files**

* **Summary:** Make sure Firebase will actually upload what we think it will.

## **2.1 Check that `dist/` exists and contains `_probe.txt`**

* **Summary:** Create a test file Firebase must upload.
* **Command:**

  ```bash
  printf "probe\n" > dist/_probe.txt && ls -l dist/_probe.txt
  ```
* **Success evidence:** `_probe.txt` listed, non-zero bytes.

## **2.2 Preview deployment**

* **Summary:** Dry-run deployment to see what Firebase will upload.
* **Command:**

  ```bash
  firebase hosting:channel:deploy preview-test --only hosting
  ```
* **Success evidence:** `_probe.txt` appears in the file upload list.

## **2.3 Example checkpoint**

* **Summary:** Prove Firebase sees `_probe.txt`.
* **Evidence:** `_probe.txt` displayed in the preview output list.

---

# **3. Phase: Minimal Deploy Validation**

* **Summary:** Simplify `firebase.json` and prove Hosting serves `_probe.txt`.

## **3.1 Simplify firebase.json**

* **Summary:** Temporarily remove rewrites and headers.
* **Content:**

  ```json
  { "hosting": { "public": "dist", "ignore": ["firebase.json", "**/.*", "**/node_modules/**"] } }
  ```
* **Success evidence:** File matches above, verified with `cat firebase.json`.

## **3.2 Deploy minimal site**

* **Command:**

  ```bash
  firebase deploy --only hosting
  ```

## **3.3 Example checkpoint**

* **Summary:** Confirm the probe is live.
* **Command:**

  ```bash
  curl -I https://gen-lang-client-0545699517.web.app/_probe.txt
  ```
* **Success evidence:** Response is `HTTP/1.1 200 OK`.
* **Failure evidence:** `404` → deployment still not reaching correct site.

---

# **4. Phase: Restore and Verify Headers**

* **Summary:** Once files deploy correctly, re-add the minimal CORS rule.

## **4.1 Add headers back**

* **Summary:** Extend firebase.json to include CORS for static assets.
* **Content:**

  ```json
  {
    "hosting": {
      "public": "dist",
      "headers": [
        {
          "source": "**/*.@(js|css|map|svg)",
          "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
        }
      ]
    }
  }
  ```

## **4.2 Deploy again**

* **Command:**

  ```bash
  firebase deploy --only hosting
  ```

## **4.3 Example checkpoint**

* **Summary:** Test actual headers for JS.
* **Command:**

  ```bash
  curl -I -H "Origin: http://127.0.0.1:5501" https://gen-lang-client-0545699517.web.app/assets/index-DQZCzI35.js
  ```
* **Success evidence:** Response includes `Access-Control-Allow-Origin: *`.
* **Failure evidence:** 200 OK with no ACAO → header rule still not applied; add explicit `/assets/**` rule next.

---

Would you like me to now generate this same plan as a **bash-ready script** that prints ✅/❌ for each checkpoint automatically (so you can just run it end-to-end)?
