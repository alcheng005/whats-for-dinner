const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    // [contenthash] will be replaced with a hash that webpack generates based on the content of the
    //  code (useful for cache busting)
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'client'),
    hot: true,
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
      new CssMinimizerWebpackPlugin(),
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()],
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
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
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
