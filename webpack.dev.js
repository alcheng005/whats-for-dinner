/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  devtool: 'eval-source-map', // remove source map warning in browser
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, 'build'),
    hot: true,
    proxy: {
      '/socket.io': { // proxy for websockets to work in devServer
        target: 'http://localhost:3000',
        ws: true,
      },
      // if invalid room code entered via URL, will redirect to home page instead of loading room
      // page with invalid code
      '/': 'http://localhost:3000',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'index.html'),
      favicon: './client/images/favicon.ico',
      minify: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});
