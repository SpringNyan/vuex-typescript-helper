const path = require("path");

module.exports = {
  mode: "development",
  entry: "./lib/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vuex-typescript-helper.js",
    library: "vuex-typescript-helper",
    libraryTarget: "umd"
  },
  externals: ["vuex"]
};
