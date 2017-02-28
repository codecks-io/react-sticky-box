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

const postCssLoaderObj = {
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
        require('csswring'),
        require('autoprefixer')
      ];
    }
  }
}

module.exports = {
  context: __dirname,
  entry: entries,
  output: {
    filename: '[name]/app.js',
  },
  module: {
    rules: [
      {test: /\.jsx?$/, loader: "babel-loader?cacheDirectory", include: srcDirs},
      {
        test: /\.less$/,
        use: [
          "style-loader", "css-loader", postCssLoaderObj, "less-loader"
        ],
        include: srcDirs
      }, {
        test: /\.css$/,
        use: [
          "style-loader", "css-loader", postCssLoaderObj
        ],
        include: srcDirs
      },
    ]
  },
  devtool: "eval",
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "react-sticky-box": "../../src/index"
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
