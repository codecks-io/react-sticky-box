const {build} = require("esbuild");
const {dependencies, peerDependencies} = require("./package.json");

const shared = {
  entryPoints: ["src/index.js"],
  bundle: true,
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
  loader: {".js": "jsx"},
};

build({
  ...shared,
  outfile: "dist/index.js",
  format: "cjs",
});

build({
  ...shared,
  outfile: "dist/index.min.js",
  minify: true,
});

build({
  ...shared,
  outfile: "dist/index.esm.js",
  format: "esm",
});

build({
  ...shared,
  outfile: "dist/index.esm.min.js",
  format: "esm",
  minify: true,
});
