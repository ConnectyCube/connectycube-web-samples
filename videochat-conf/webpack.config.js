const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = env => ({
  mode: env.production ? "production" : "development",
  entry: env.production ? "./src/index.js" : ["webpack/hot/dev-server", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    sourceMapFilename: "main.map",
    libraryTarget: "umd"
  },
  optimization: {
    minimize: !env.non_minimize
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: "index.html", to: "index.html" },
      { from: "manifest.json", to: "manifest.json" },
      { from: "styles", to: "styles" },
      { from: "images", to: "images" },
      { from: "audio", to: "audio" },
    ])
  ],
  watch: env.development,
  devtool: env.production ? false : "source-map",
  devServer: {
    open: true,
    writeToDisk: true,
    contentBase: [path.join(__dirname, "./"), path.join(__dirname, "./dist")],
    historyApiFallback: true,
    https: true,
    host: "127.0.0.1",
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-optional-chaining"
              ]
            }
          }
        ]
      }
    ]
  },
  externals: ["node-fetch", "form-data"]
});
