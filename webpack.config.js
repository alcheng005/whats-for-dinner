const path = require('path');
const CleanWpPi = require('clean-webpack-plugin');
const HtmlWpPi = require('html-webpack-plugin');
const MiniCssExPi = require('mini-css-extract-plugin');
const CssMiniWpPi = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    // [contenthash] will be replaced with a hash that webpack generates based on the content of the
    //  code (useful for cache busting)
    filename: 'bundle.[contenthash].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'client'),
    hot: true,
    // match the output's 'publicPath'
    publicPath: '/',
    proxy: {
      '/': 'http://localhost:3000',
    },
  },
  mode: process.env.NODE_ENV,
  optimization: {
    minimizer: [
      // for webpack@5 can use '...' to extend existing minimizers (i.e. `terser-webpack-plugin` for
      // JS minification)
      '...',
      new CssMiniWpPi(),
    ],
  },
  plugins: [
    new CleanWpPi(),
    new HtmlWpPi({
      template: './client/index.html',
    }),
    new MiniCssExPi({
      filename: '[name].[contenthash].[ext]',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: 'html-loader',
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExPi.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.(png|jpg|jpeg)$/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[name].[hash].[ext]',
      //       outputPath: "images"
      //     }
      //   }
      // }
    ],
  },
};
