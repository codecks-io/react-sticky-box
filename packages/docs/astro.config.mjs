// @ts-check
/** @type {import('astro').AstroUserConfig} */

import {defineConfig} from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import {resolve, dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  integrations: [react(), mdx()],

  vite: {
    resolve: {
      alias: {
        "react-sticky-box": resolve(__dirname, "../react-sticky-box/src/index.tsx"),
      },
    },
  },

  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
    },
  },
});
