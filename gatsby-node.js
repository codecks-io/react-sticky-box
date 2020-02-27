const path = require("path");

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        "react-sticky-box": path.resolve(__dirname, "../src/index"),
      },
    },
  });
};
