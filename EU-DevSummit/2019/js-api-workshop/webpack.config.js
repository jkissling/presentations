const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");
const webpack = require("webpack");
const yargs = require("yargs")
const fs = require("fs");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


if (!fs.existsSync("../certificate.pfx")) {
  console.log("=========================================")
  console.log("=========================================")
  console.error("There is no certificate.pfx file.");
  console.error("Please follow the steps in certificate.md to create it");
  console.log("=========================================")
  console.log("=========================================")
}

var webpackConfig = {
  entry: {
    index: ["./src/index.tsx"]
  },
  output: {
    filename: "[name].js",
    publicPath: "",
    libraryTarget: "amd-require"
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    proxy: {}
  },
  devtool: "source-map",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "resolve-url-loader",
            options: {
              includeRoot: true
            }
          },
          "sass-loader?sourceMap"
        ],
        exclude: /src\/assets/
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
        , {
          loader: 'react-hot-loader/webpack'
        }
      ]
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        loader: "url-loader",
        options: {
          // Inline files smaller than 10 kB (10240 bytes)
          limit: 10 * 1024,
        }
      },
      {
        test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "build/[name].[ext]"
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebPackPlugin({
      title: "ArcGIS Template Application",
      template: "./src/index.html",
      filename: "./index.html",
      // favicon: "./src/assets/int_favicon.png",
      chunksSortMode: "none",
      inlineSource: ".(css)$"
    }),
    new webpack.HotModuleReplacementPlugin(),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    new CopyWebpackPlugin([{
        from: "assets/**/*",
        context: "src"
      },
      {
        from: "oauth-callback.html",
        context: "src"
      },
      {
        from: "config/**/*",
        context: "src"
      },
      {
        from: "lang/**/*",
        context: "src"
      }
    ])
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, "/src"),
      path.resolve(__dirname, "node_modules/")
    ],
    extensions: [".ts", ".tsx", ".js", ".scss", ".css"]
  },
  node: {
    process: true,
    global: false,
    fs: "empty"
  },
  externals: [
    function (context, request, callback) {
      if (/^dojo/.test(request) ||
        /^dojox/.test(request) ||
        /^dijit/.test(request) ||
        /^esri\//.test(request)
      ) {
        return callback(null, "amd " + request);
      }
      callback();
    }
  ]
};

module.exports = webpackConfig;