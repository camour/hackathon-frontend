const path = require('path');

module.exports = {
  mode: "production",
  devServer: {
    inline:true,
    host: '0.0.0.0',
    port: 80,
    disableHostCheck: true,
  },
  entry: {
    //app: "./src/index.js"
  },
  output: {
    //filename: "[name].bundle.js",
    //path: path.resolve(__dirname, "dist")
  },
};