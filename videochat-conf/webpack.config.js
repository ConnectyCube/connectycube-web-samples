const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => ({
  mode: env.production ? 'production' : 'development',
  entry: env.production
    ? './src/index.js'
    : ['webpack/hot/dev-server', './src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    sourceMapFilename: 'main.map',
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: !env.non_minimize,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'index.html', to: 'index.html' },
        { from: 'src/events-service.js', to: 'events-service.js' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'styles', to: 'styles' },
        { from: 'images', to: 'images' },
        { from: 'audio', to: 'audio' },
      ],
    }),
  ],
  devtool: env.production ? false : 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, './'),
      watch: true,
    },
    historyApiFallback: true,
    port: 8000,
    hot: true,
  },
  performance: {
    hints: false,
    assetFilter: (filename) => !/\.mp3$/i.test(filename),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-optional-chaining',
              ],
            },
          },
        ],
      },
    ],
  },
  externals: ['node-fetch', 'form-data'],
});
