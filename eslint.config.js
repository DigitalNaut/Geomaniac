import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";
// TODO: Reimplement this when eslint-plugin-tailwindcss supports Tailwind 4
// See: https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/325
// import tailwind from "eslint-plugin-tailwindcss";
import noRelativeImports from "eslint-plugin-no-relative-import-paths";
import queryExhaustiveDeps from "@tanstack/eslint-plugin-query";

export default defineConfig(
  // TODO: Reimplement this when eslint-plugin-tailwindcss supports Tailwind 4
  // ...tailwind.configs["flat/recommended"],
  { ignores: ["node_modules", "build", "dist", "coverage", "tools"] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "no-relative-import-paths": noRelativeImports,
      "@tanstack/query": queryExhaustiveDeps,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
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
    },
    settings: {
      tailwindcss: {
        whitelist: ["(fa\\-|leaflet\\-).+"], // Prefixes followed by at least one character
        callees: ["twMerge", "twJoin", "cn", "tw"], // Defaults: ["classnames", "clsx", "ctl"] See: https://www.npmjs.com/package/eslint-plugin-tailwindcss#more-settings
      },
    },
  },
);
