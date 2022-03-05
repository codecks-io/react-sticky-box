// @ts-check
/** @type {import('astro').AstroUserConfig} */
const config = {
  renderers: ["@astrojs/renderer-react"],

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
