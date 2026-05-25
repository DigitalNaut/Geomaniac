import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * For babel-plugin-react-compiler in Vite v8
   * @see https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#react-compiler
   */
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr(), tailwindcss()],
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
  assetsInclude: ["**/*.mp3"],
});
