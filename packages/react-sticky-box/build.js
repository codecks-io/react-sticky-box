import {build} from "esbuild";

// based on https://github.com/evanw/esbuild/issues/619#issuecomment-751995294
const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    const filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"

    // to resolve webpack issues: https://github.com/codecks-io/react-sticky-box/issues/87
    const addDotJs = new Set(["react/jsx-runtime"]);
    build.onResolve({filter}, (args) => ({
      path: addDotJs.has(args.path) ? `${args.path}.js` : args.path,
      external: true,
    }));
  },
};

const shared = {
  plugins: [makeAllPackagesExternalPlugin],
  entryPoints: ["src/index.tsx"],
  bundle: true,
  format: "esm",
};

build({
  ...shared,
  outfile: "dist/index.js",
});

build({
  ...shared,
  outfile: "dist/index.min.js",
  minify: true,
});
