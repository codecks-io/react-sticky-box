import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

const pure = process.env.PURE === "true";

export default {
  entry: "src/index.js",
  plugins: [
    resolve({}),
    commonjs({include: "node_modules/**"}),
    babel({
      exclude: "node_modules/**", // only transpile our source code,
      runtimeHelpers: true,
      presets: pure
        ? ["react"]
        : [
            "react",
            [
              "es2015",
              {
                modules: false,
              },
            ],
          ],
      plugins: [
        "transform-class-properties",
        [
          "transform-react-remove-prop-types",
          {
            mode: "unsafe-wrap",
            ignoreFilenames: ["node_modules"],
          },
        ],
        ["transform-object-rest-spread", pure ? {useBuiltIns: true} : {}],
        [
          "transform-runtime",
          {
            polyfill: !pure,
            regenerator: false,
          },
        ],
        ...(pure ? [["transform-react-jsx", {useBuiltIns: true}]] : []),
      ],
    }),
  ],
  external: id =>
    pkg.peerDependencies[id] || pkg.dependencies[id] || id.indexOf("babel-runtime") === 0,
};
