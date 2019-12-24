const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common.js');
const DefineConfig = require('./config/dev.config.js');
module.exports = WebpackMerge(common, {
  devServer: {
    mode: 'development',
    contentBase: './public',
    proxy: {
      '/api': {
        target: 'http://test.com',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    },
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      ...DefineConfig
    })
  ]
})