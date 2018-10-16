import path from "path";
import {css} from "docz-plugin-css";

export default {
  title: "React Sticky Box",
  description: "Sticky scrolling for all contents of all sizes",
  src: "docs",
  ordering: "ascending",
  modifyBundlerConfig: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-sticky-box": path.join(__dirname, "src"),
    };
    return config;
  },
  plugins: [
    css({
      preprocessor: "postcss",
      cssmodules: true,
    }),
  ],
};
