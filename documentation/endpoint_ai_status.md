`markdown
# API Endpoint Recon — `https://getairesponse-qyordqv5ta-uc.a.run.app`

## Summary
- **Endpoint is live** (Google Cloud Functions Gen 2 / Cloud Run; Express).
- **CORS preflight works** and reflects `Origin`.
- **Input validation exists** for missing fields.
- **Auth handling is weak** (returns `500` instead of `401/403`).
- **Gemini call failing** due to **insufficient authentication scopes**.
- Occasional **request-body issues** (malformed JSON / wrong shapes) surfaced in logs.

---

## Reachability & Methods
- **GET /** → `404 Not Found` (`Cannot GET /`)  
  - Confirms no GET route; service is up.
- **OPTIONS /** (preflight) → `204 No Content`  
  - `access-control-allow-origin: https://example.com` (reflects origin)  
  - `access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE`  
  - `access-control-allow-headers: Content-Type, Authorization`  
  - `vary: Origin, Access-Control-Request-Headers`  
  - ✅ Cross-origin embedding supported.

---

## Authorization Behavior
- **POST** without `Authorization` → `500 Internal Server Error`
- **POST** with `Authorization: Bearer INVALID_KEY` → `500 Internal Server Error`
- Expected: `401/403` with a structured error.
- **Conclusion:** Auth errors are not handled gracefully; generic 500s leak through.

---

## Request Validation & Schema
- **POST `{}`** (with dummy auth) → `400 Bad Request`  
  - Body: `{"error":"Bad Request: Missing required fields."}`  
  - ✅ Input guard present.
- **POST minimal valid shape expected**:
  json
  {
    "prompt": "hello",
    "availableFacets": [],
    "filteredProducts": []
  }
`

* Logs show **shape mismatch** when `filteredProducts` is **not an array**:

  * `TypeError: filteredProducts.slice is not a function`
  * Indicates server assumes `filteredProducts` is an array.

---

## Response Format

* On success path (not yet observed), expected **JSON** per `AIExtractionResponse`.
* When failing auth or internal errors, current responses are:

  * `500` with `content-type: text/plain` (`Internal Server Error`)
  * Body-parser errors when request JSON was malformed (see below).

---

## Errors Observed (from Cloud Logs)

* **Gemini API auth scope error (root cause of 500 on valid payloads)**:

  
  ApiError 403 PERMISSION_DENIED: Request had insufficient authentication scopes.
  service: generativelanguage.googleapis.com
  method: google.ai.generativelanguage.v1beta.GenerativeService.GenerateContent
  

  * **Interpretation:** Function service account lacks the necessary scopes/roles to call Gemini.

* **Request shape error**:

  
  TypeError: filteredProducts.slice is not a function
  at buildPrompt (...)
  

  * Sent a non-array `filteredProducts`.

* **Malformed JSON (PowerShell multi-line / quoting pitfalls)**:

  
  SyntaxError: Expected property name or '}' in JSON at position 1
  at body-parser/lib/types/json.js
  

  * Caused by shell line breaks / escaping issues.

---

## Environment & Deployment Details (from logs)

* **Project:** `gen-lang-client-0545699517`
* **Function name/URL:**

  * CF Gen2 function: `getAIResponse`
  * Cloud Run URL: `https://getairesponse-qyordqv5ta-uc.a.run.app`
  * CF URL (Google-managed): `https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getAIResponse`
* **Runtime:** Node.js **22** (Gen 2)
* **Service account:** `253278659379-compute@developer.gserviceaccount.com`
* **Secrets configured:** `API_KEY` (**version 3**) as secret env var
* **CORS:** Implemented in function (preflight returns proper headers)
* **Startup/Autoscaling:** Healthy (startup TCP probe OK; autoscaling events observed)

---

## Test Artifacts (commands & results)

### Basic Reachability

* `curl.exe -i https://getairesponse-qyordqv5ta-uc.a.run.app` → `404 Not Found` (`Cannot GET /`)

### CORS Preflight

* `OPTIONS` with origin/headers → `204 No Content`, allowed methods/headers present, origin reflected.

### Authorization Enforcement

* `POST` (no auth) → `500 Internal Server Error`
* `POST` (invalid auth) → `500 Internal Server Error`

  * **Expected:** `401/403` with JSON error; **Observed:** generic 500.

### Request Validation

* `POST {}` (with dummy auth) → `400 Bad Request` w/ JSON error (good guard).
* `POST {"prompt":"hello"}` (with dummy auth) → `500` (root cause: Gemini scope issue or downstream error).

---

## Current Gaps / Issues

* **IAM/Scopes:** Cloud Function cannot call Gemini (`PERMISSION_DENIED` 403).
* **Auth UX:** Missing/invalid token → 500 instead of 401/403 (needs explicit checks).
* **Schema resilience:** Assumes arrays; should validate/coerce input to avoid `.slice` errors.
* **Error surfaces:** Plain-text 500s; prefer consistent JSON error envelopes.
* **Shell pitfalls:** PowerShell line continuation caused malformed JSON during manual tests.

---

## Next Test Targets (in order)

* **Authorization enforcement:** Verify 401/403 on missing/invalid tokens (add guard).
* **Gemini IAM:** Grant proper scopes/roles to service account; re-test successful AI path.
* **Valid schema path:** Send correct minimal payload arrays → confirm 200 + JSON `AIExtractionResponse`.
* **Latency & stability:** Measure p50/p95; check rate-limit behavior.
* **Payload limits:** Large prompt/product arrays; confirm truncation guards and stable behavior.

---


::contentReference[oaicite:0]{index=0}

