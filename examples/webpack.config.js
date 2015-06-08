var path = require("path");

var srcDirs = [__dirname, path.join(__dirname, "..", "src")];

module.exports = {
  context: __dirname,
  entry: "./app.js",
  output: {
    filename: "bundle.js"
  },
  module: {
    preLoaders: [
      {test: /\.jsx?$/, loader: "eslint", include: srcDirs}
    ],
    loaders: [
      {test: /\.jsx?$/, loader: "babel?cacheDirectory", include: srcDirs},
      {test: /\.less$/, loader: "style!css!postcss!less", include: srcDirs},
      {test: /\.css$/, loader: "style!css!postcss", include: srcDirs}
    ]
  },
  devtool: "eval",
  postcss: [require("autoprefixer-core"), require("csswring")],
  resolve: {
    extensions: ["", ".js", ".jsx"],
    alias: {
      "react-scroll-box": "../src/index"
    }
  },
  devServer: {
    contentBase: __dirname,
    stats: {
      chunkModules: false,
      colors: true
    }
  }
};
