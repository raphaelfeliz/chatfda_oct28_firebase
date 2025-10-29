# Guide: Interact with getGeminiResponseV2

Endpoint
- URL: https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getGeminiResponseV2
- Method: POST
- CORS: Enabled (OPTIONS preflight supported)

## Authentication (include the key)
This endpoint requires a Bearer token in the Authorization header. Use the value of the WIDGET_API_KEY secret for requests.

- Key (WIDGET_API_KEY): Ge41424344
- Header: Authorization: Bearer Ge41424344
- Do NOT use the Gemini API_KEY here; that is used server-side.

How to obtain the key (securely):
- For this environment, the key is provided above; you do not need to retrieve it.
- Optionally: Firebase Console → Security → Secret Manager → WIDGET_API_KEY → View latest version → Copy value
- Or via gcloud CLI (requires proper auth and project):
  gcloud secrets versions access latest --secret="WIDGET_API_KEY" --project="gen-lang-client-0545699517"

Security notes:
- Treat the key as sensitive. Avoid committing secrets to public repos or embedding them in public clients.
- Prefer using environment variables or a secure vault for local scripts.

## Request shape
- Content-Type: application/json
- Body: { "prompt": string }

Examples:
- Minimal: { "prompt": "hello" }
- Strict JSON: { "prompt": "Return only this exact JSON: {\"status\":\"ok\",\"source\":\"test\"} with no extra text." }

## Response behavior
- 200 OK: Successful response
  - If the model output is valid JSON (or JSON within code fences), the function responds with Content-Type: application/json and a JSON body.
  - Otherwise, the function responds with Content-Type: text/html; charset=utf-8 and a text body.
- 400 Bad Request: Missing or invalid prompt
- 401 Unauthorized: Missing or invalid Authorization header

Notes
- The function attempts to parse JSON when present (also handles ```json fenced blocks). When parsing fails, it falls back to text.
- CORS headers are included for browser clients.

## Quick start options

### 1) Use the included tester page (recommended)
File: test.html in the repo root.
- Open the file in a browser
- Paste your WIDGET_API_KEY into the Bearer token field
- Enter a prompt or click a preset (e.g., Strict JSON)
- Send request and review status, content type, and response body

### 2) Windows PowerShell (Invoke-WebRequest)

$Url = "https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getGeminiResponseV2"
$Token = $Env:WIDGET_API_KEY  # or paste your token
$Body = @{ prompt = "hello" } | ConvertTo-Json -Compress

$Headers = @{ 
  "Authorization" = "Bearer $Token" 
  "Content-Type"  = "application/json"
}

$response = Invoke-WebRequest -Method POST -Uri $Url -Headers $Headers -Body $Body
$response.StatusCode
$response.Headers["Content-Type"]
$response.Content

### 3) Windows curl.exe (single line)

curl.exe -i -X POST "https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getGeminiResponseV2" -H "Authorization: Bearer YOUR_WIDGET_API_KEY_HERE" -H "Content-Type: application/json" --data '{"prompt":"hello"}'

For strict JSON:

curl.exe -i -X POST "https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getGeminiResponseV2" -H "Authorization: Bearer YOUR_WIDGET_API_KEY_HERE" -H "Content-Type: application/json" --data '{"prompt":"Return only this exact JSON: {\"status\":\"ok\",\"source\":\"test\"} with no extra text."}'

### 4) Browser fetch (JavaScript)

const url = "https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getGeminiResponseV2";
const token = "YOUR_WIDGET_API_KEY_HERE"; // Avoid exposing this in public code

const resp = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ prompt: "hello" })
});

const ct = resp.headers.get("content-type") || "";
const text = await resp.text();
const maybeJson = /application\/json/i.test(ct) ? JSON.parse(text) : text;
console.log(maybeJson);

### 5) Node.js (fetch)

import fetch from "node-fetch"; // Node < 18; for Node >= 18, global fetch exists

const url = "https://us-central1-gen-lang-client-0545699517.cloudfunctions.net/getGeminiResponseV2";
const token = process.env.WIDGET_API_KEY; // set securely in your environment

async function run() {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: "hello" }),
  });
  const ct = resp.headers.get("content-type") || "";
  const text = await resp.text();
  const data = /application\/json/i.test(ct) ? JSON.parse(text) : text;
  console.log(resp.status, ct, data);
}

run().catch(console.error);

## Troubleshooting
- 401 Unauthorized: Ensure the Authorization header is present and the token is correct.
- 400 Bad Request: Ensure the body includes a non-empty "prompt" string.
- CORS issues: Preflight (OPTIONS) should return 204 with Access-Control-Allow-Origin. Ensure requests originate from allowed contexts and that your browser isn’t blocking due to extensions or mixed content.
- Not JSON: If you require JSON, instruct the model to return only JSON. The function parses JSON (including from code fences) when possible.

## Change log (behavioral summary)
- getGeminiResponseV2 mirrors getGeminiResponse behavior with standardized auth and CORS handling.
- Returns application/json when valid JSON detected, else text/html fallback.
