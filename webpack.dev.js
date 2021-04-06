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
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'build'),
    hot: true,
    proxy: {
      // proxy for websockets to work in devServer
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
      // '/room': 'http://localhost:3000/room',
      // '/': 'http://localhost:3000',
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
