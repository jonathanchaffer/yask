import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
    rules: {
      // Disallow relative imports from parent directories (e.g. `../foo`).
      // Relative imports from siblings (e.g. `./foo`) are still allowed.
      "no-restricted-imports": ["error", { patterns: ["..*"] }],

      // Disallow unused variables, except for variables prefixed with an
      // underscore.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
];
