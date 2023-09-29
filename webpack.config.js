const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "js/entry.js",
  },
  output: {
    path: `${__dirname}/public`,
    filename: "js/[name].bundle.js",
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"],
    extensions: [".js"],
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
};
