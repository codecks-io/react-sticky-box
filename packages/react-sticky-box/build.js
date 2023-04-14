import {build} from "esbuild";

// based on https://github.com/evanw/esbuild/issues/619#issuecomment-751995294
const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    const filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"

    build.onResolve({filter}, (args) => ({
      path: args.path,
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
