import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

const baseImportRestrictions = ["..*"];

/**
 * Generate a config that disallows imports from a specified directory in the
 * specified files.
 */
const disallowImports = (args) => {
  return {
    files: [`src/${args.in}/**/*.{js,mjs,cjs,ts}`],
    rules: {
      // Disallow imports from the specified directory.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...baseImportRestrictions,
            ...args.from.map((directory) => `~/${directory}/**`),
          ],
        },
      ],
    },
  };
};

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  { ignores: ["**/node_modules/**", "**/dist/**"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
    rules: {
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

      // Disallow relative imports from parent directories (e.g. `../foo`).
      // Relative imports from siblings (e.g. `./foo`) are still allowed.
      "no-restricted-imports": [
        "error",
        { patterns: [...baseImportRestrictions] },
      ],
    },
  },
  // Directory-specific import restrictions.
  disallowImports({ in: "app/services", from: ["db"] }),
  disallowImports({ in: "modules", from: ["db", "app"] }),
  disallowImports({ in: "db", from: ["app"] }),
];
