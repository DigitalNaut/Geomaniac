import js from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";
import noRelativeImports from "eslint-plugin-no-relative-import-paths";
import { defineConfig } from "eslint/config";

export default defineConfig(
  { ignores: ["dist", "coverage", "tools"] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "no-relative-import-paths": noRelativeImports,
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "object-shorthand": ["warn", "always"],
      "no-useless-rename": "warn",
      "consistent-return": ["warn"],
      "no-use-before-define": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
