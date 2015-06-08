var path = require("path");
var fs = require('fs');

var srcDirs = [__dirname, path.join(__dirname, "..", "src")];

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

var entries = fs.readdirSync(__dirname).reduce(function (entries, dir) {
  var isDraft = dir.charAt(0) === '_';

  if (!isDraft && isDirectory(path.join(__dirname, dir)))
    entries[dir] = path.join(__dirname, dir, 'app.js');

  return entries;
}, {});

module.exports = {
  context: __dirname,
  entry: entries,
  output: {
    filename: '[name]/app.js',
  },
  module: {
    preLoaders: [
      // {test: /\.jsx?$/, loader: "eslint", include: srcDirs}
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
      "react-scroll-box": "../../src/index"
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
