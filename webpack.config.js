const path = require('path');

module.exports = {
  mode: "production",
  devServer: {
    inline:true,
    port: 80
  },
  entry: {
    //app: "./src/index.js"
  },
  output: {
    //filename: "[name].bundle.js",
    //path: path.resolve(__dirname, "dist")
  }
};