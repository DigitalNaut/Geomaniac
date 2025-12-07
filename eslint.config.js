import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";

import noRelativeImports from "eslint-plugin-no-relative-import-paths";
import queryExhaustiveDeps from "@tanstack/eslint-plugin-query";

export default defineConfig(
  { ignores: ["node_modules", "build", "dist", "coverage", "tools"] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "no-relative-import-paths": noRelativeImports,
      "@tanstack/query": queryExhaustiveDeps,
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-console": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-relative-import-paths/no-relative-import-paths": ["warn", { allowSameFolder: true }],
      "object-shorthand": ["warn", "always"],
      "consistent-return": ["warn"],
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-use-before-define": "warn",
      "@tanstack/query/exhaustive-deps": "warn",
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
      // See: https://github.com/schoero/eslint-plugin-better-tailwindcss/issues/243#issuecomment-3562127924
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/no-unregistered-classes": ["warn", { ignore: ["(fa\\-|leaflet\\-).+"] }],
    },
    settings: {
      tailwindcss: {
        whitelist: ["(fa\\-|leaflet\\-).+"], // Prefixes followed by at least one character
        callees: ["twMerge", "twJoin", "cn", "tw"], // Defaults: ["classnames", "clsx", "ctl"] See: https://www.npmjs.com/package/eslint-plugin-tailwindcss#more-settings
      },
      "better-tailwindcss": {
        entryPoint: "src/styles/input.css",
      },
    },
  },
);
