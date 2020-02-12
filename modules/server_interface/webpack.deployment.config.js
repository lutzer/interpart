/* eslint-disable */
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    output: {
        filename: 'bundle.js',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/index.html",
          filename: "./index.html"
        })
    ],
    optimization: {
        minimizer: [
          new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
              compress: {
                inline: false
              }
            }
          })
        ],
        runtimeChunk: false,
        splitChunks: {
          cacheGroups: {
            default: false,
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor_app',
              chunks: 'all',
              minChunks: 2
            }
          }
        }
      },
}