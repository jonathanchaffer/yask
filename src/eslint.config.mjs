import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // disallow relative imports in all source files
      "no-restricted-imports": ["error", { patterns: [".*"] }],
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
];
