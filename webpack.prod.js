const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'index.html'),
      favicon: './client/images/favicon.ico',
    }),
  ],
  optimization: {
    minimizer: [
      // for webpack@5 can use '...' to extend existing minimizers (i.e. `terser-webpack-plugin` for
      // JS minification)
      '...',
      new CssMinimizerWebpackPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
});
