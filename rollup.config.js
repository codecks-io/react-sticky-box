import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import fs from "fs";
import pkg from "./package.json";

const pure = process.env.PURE === "true";

export default {
  entry: "src/index.js",
  plugins: [
    resolve({
      // remove this once https://github.com/rollup/rollup-plugin-babel/issues/148 is resolved
      customResolveOptions: {
        isFile: function(file, cb) {
          if (file.indexOf("babel-runtime") > 0) return cb(null, false);
          fs.stat(file, function(err, stat) {
            if (err && err.code === "ENOENT") cb(null, false);
            else if (err) cb(err);
            else cb(null, stat.isFile());
          });
        }
      }
    }),
    commonjs({ include: "node_modules/**" }),
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
                modules: false
              }
            ]
          ],
      plugins: [
        "transform-class-properties",
        [
          "transform-react-remove-prop-types",
          {
            mode: "unsafe-wrap",
            ignoreFilenames: ["node_modules"]
          }
        ],
        ["transform-object-rest-spread", pure ? { useBuiltIns: true } : {}],
        [
          "transform-runtime",
          {
            polyfill: !pure,
            regenerator: false
          }
        ],
        ...(pure ? [["transform-react-jsx", { useBuiltIns: true }]] : [])
      ]
    })
  ],
  external: [
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.dependencies)
  ]
};
