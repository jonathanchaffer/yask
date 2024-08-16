import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-restricted-imports": ["error", { patterns: ["..*"] }],
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
];
