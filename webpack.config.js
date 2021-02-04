const path = require("path");
module.exports = {
  entry: "./src/menu.js",
  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "./"),
  },
};
