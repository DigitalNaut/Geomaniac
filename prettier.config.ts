import { type Config } from "prettier";

const config: Config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  printWidth: 120,
  plugins: ["prettier-plugin-tailwindcss"],

  // See: https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  tailwindStylesheet: "./src/styles/input.css",
  tailwindPreserveWhitespace: false,
  tailwindFunctions: ["clsx", "twMerge", "twJoin", "cn", "tw"],
};

export default config;
