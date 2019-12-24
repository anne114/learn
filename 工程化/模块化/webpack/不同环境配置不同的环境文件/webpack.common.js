const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [{
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 //大于10kb就不要转化为data:Urls协议的资源了
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'html webpack sample',
      author: 'anne',
      meta: {
        "viewport": "width=device-width"
      },
      template: './index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    new VueLoaderPlugin(),
  ]
}