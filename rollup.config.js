import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

const pure = process.env.PURE === "true";
const format = process.env.BUILD_FORMAT;

export default {
  input: "src/index.js",
  output: {format},
  plugins: [
    nodeResolve({jsnext: true, main: true}),
    commonjs({include: "node_modules/**"}),
    babel({
      exclude: "node_modules/**", // only transpile our source code,
      runtimeHelpers: true,
      presets: [
        "@babel/preset-react",
        [
          "@babel/env",
          {
            modules: false,
            loose: true,
            targets: {
              browsers: pure
                ? ["last 1 chrome version", "last 1 firefox version"]
                : ["ie 10", "ios 7"],
            },
          },
        ],
      ],
      plugins: [
        [
          "transform-react-remove-prop-types",
          {
            mode: "unsafe-wrap",
            ignoreFilenames: ["node_modules"],
          },
        ],
        ["@babel/transform-runtime"],
        ["@babel/proposal-class-properties", {loose: true}],
        "minify-dead-code-elimination",
      ],
    }),
  ],
  external: id =>
    pkg.peerDependencies[id] || pkg.dependencies[id] || id.indexOf("@babel/runtime") === 0,
};
