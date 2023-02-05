// @ts-check
/** @type {import('astro').AstroUserConfig} */

import {resolve, dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  renderers: ["@astrojs/renderer-react"],

  vite: {
    resolve: {
      alias: {
        "react-sticky-box": resolve(__dirname, "../react-sticky-box/src/index.tsx"),
      },
    },
  },

  markdownOptions: {
    render: [
      "@astrojs/markdown-remark",
      {
        syntaxHighlight: "shiki",
        shikiConfig: {
          theme: "github-dark",
          langs: ["jsx", "bash"],
          wrap: false,
        },
      },
    ],
  },
};
export default config;
