// C:\dev\aiStudio\widget_prototype_V2.1\widget_poc_v3\functions\.eslintrc.js
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // --- THIS IS THE FIX ---
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    // ---------------------
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    ".eslintrc.js", // Ignore this file itself.
    // --- NEW EXCLUSION ---
    "src/product_data.ts", // Exclude data file with expected lint issues.
    // ---------------------
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
    rules: {
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "max-len": ["error", {"code": 120}],
    "linebreak-style": "off", // Add this line
  },
};