const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common.js');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefineConfig = require('./config/pro.config.js');

module.exports = WebpackMerge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      'public/**'
    ]),
    new webpack.DefinePlugin({
      ...DefineConfig
    })
  ]
})