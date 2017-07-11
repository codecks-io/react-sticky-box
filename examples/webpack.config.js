const path = require("path");
const fs = require("fs");

const srcDirs = [path.join(__dirname, "..", "src")];
const srcDir = path.join(__dirname, "src");

const isDirectory = dir => fs.lstatSync(dir).isDirectory();
const entries = fs
  .readdirSync(srcDir)
  .filter(dir => dir.charAt(0) !== "_")
  .filter(dir => isDirectory(path.join(srcDir, dir)))
  .reduce((memo, dir) => {
    srcDirs.push(path.join(srcDir, dir));
    memo[dir] = path.join(srcDir, dir, "app.js");
    return memo;
  }, {});

module.exports = {
  entry: entries,
  output: {
    filename: "[name]/app.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          presets: ["react", "es2015"],
          plugins: ["transform-class-properties", "transform-object-rest-spread"],
        },
        include: srcDirs,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        include: srcDirs,
      },
    ],
  },
  devtool: "eval",
  resolve: {
    modules: [path.join(__dirname, "node_modules"), path.join(__dirname, "..", "node_modules")],
    extensions: [".js", ".jsx"],
    alias: {
      "react-sticky-box": path.join(__dirname, "..", "src"),
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    stats: {
      chunkModules: false,
      colors: true,
    },
  },
};
