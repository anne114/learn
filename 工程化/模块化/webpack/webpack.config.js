const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// 自己编写的清除注释的plugin
const cleanNote = require("./myplugins/cleanNote");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  //入口文件，为相对路径时，前面的./不能省略
  entry: {
    index: "./src/index.js",
    about: "./src/about.js"
  },
  //打包之后的文件
  output: {
    filename: "[name].[contenthash:8].js", //打包之后的文件名,通过[name]占位符来设置打包后的文件名跟入口文件名保持一致
    path: path.join(__dirname, "dist"), //path必须要是绝对路径，因此需要使用path.join()方法，得到output的绝对路径
    publicPath: "/" //定义从哪个路径加载打包之后的静态资源文件，页面默认是从根目录下加载资源文件,实际应用中静态资源文件都是放在cdn上的，所以在生产环境，该值为cdn资源地址
  },
  // 打包模式：有development、production、none（不常用）三种模式，每种模式会对应地启动一些插件，如development模式会自动优化打包速度，不会压缩代码，而production模式会自动压缩代码等，这在某种程度上减少了我们的工作
  mode: "none",
  // webpack只能打包js文件，其他资源需要使用对应的loader，该loader会将资源转化为js模块
  module: {
    // 配置打包规则，必须包含test和use字段，test：通过正则找到对应的文件类型，use：使用对应的loader加载资源
    rules: [
      {
        test: /.css$/,
        // use的值可以使字符串、数组、对象
        // 当需要使用多个loader时，loader的执行顺序是从后往前执行
        // css-loader是将css资源转化为js资源，style-loader是将该资源通过style标签插入到页面中
        use: [
          // 将样式代码通过style标签加入到页面当中,如果需要将css打包到单独的css文件中，则使用MiniCssExtractPlugin.loader
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          // url-loader通过设置limit，将小于这个大小的模块转化为ata:Urls协议的资源，而大于这个大小的，会使用file-loader将文件复制到输出目录，因此需要安装同时file-loader
          loader: "url-loader",
          options: {
            limit: 10 * 1024 //大于10kb就不要转化为data:Urls协议的资源了
          }
        }
      },
      {
        test: /\.js$/,
        // babel相当于一个js转化平台，真正的转化是通过@babel/core核心模块就行转化的，而需要转化哪些新特性是通过presets字段决定的，@babel/preset-env模块是所有新特性的集合
        // 因此需要安装babel-loader @babel/core @babel/preset-env三个模块
        use: {
          loader: "babel-loader"
          // options也可以通过在根目录下创建.babelrc文件来定义
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      },
      {
        test: /\.md$/,
        use: "./markdown-loader" //use不仅可以使用模块名称，还可以使用相对路径，跟require一样
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    // 构建时删除输出目录
    new CleanWebpackPlugin(),
    // 创建html文件，可通过配置向html模板文件中传值
    new HtmlWebpackPlugin({
      title: "html webpack sample",
      author: "anne",
      meta: {
        viewport: "width=device-width"
      },
      template: "./index.html",
      chunks: ["index"] //多页面打包，会生成多个js文件，通过chunks决定该页面需要引用哪些js文件
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
      chunks: ["about"]
    }),
    // 接收一个数组，每个元素是要copy的文件，可以是一个通配符，可以是一个文件夹，可以是一个具体的路径
    new CopyWebpackPlugin([
      "public/**" //这种写法打包到输出目录时会保留public目录，'public'这种写法不会保留public目录
    ]),
    // 在vue文件中，有template、style、script三大顶级元素，这三个元素需要使用不同的loader去处理，此插件就是用于处理这个的
    new VueLoaderPlugin(),
    // 向js代码中注入全局环境变量，在js文件中可以直接使用这些变量,需要使用JSON.stringify进行转义
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify("http://www.baidu.com")
    }),
    // 将css提取到单独的.css文件，如果有此需求，则在module的.css的loader中，就不能使用style-loader了，需要使用MiniCssExtractPlugin.loader
    new MiniCssExtractPlugin(),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // 自定写的一个插件，去除/*****/注释
    new cleanNote()
  ],
  // 设置开发环境配置
  devServer: {
    // 只有打包到输出文件的资源才能通过服务器访问到，如果想访问其他资源，可以通过contentBase设置，其值可以是一个字符串或者数组
    contentBase: "./public",
    // 添加代理配置,是一个对象，key值是匹配的地址规则，value是代理的配置
    proxy: {
      // 如果请求是以/api开头的，则请求会被代理到target所设置的地址
      // pathRewrite会把匹配到的字符串（key值）替换为它对应的value值
      // ex:http://localhost:8080/api/user => http://test.com/user
      "/api": {
        target: "http://test.com",
        pathRewrite: {
          "^/api": ""
        },
        // 在发起请求的过程中会把请求来源（页面地址）发送给服务器，有些服务器是会校验请求来源的，此时可以通过此设置将请求来源配置成请求地址
        // ex：配置之后，请求来源就从localhost变成了test.com
        changeOrigin: true
      }
    },
    // HMR:Hot Module Replacement,模块热更新：实现模块变化时页面不刷新也可以实时更新模块
    hot: true
  },
  devtool: "cheap-module-source-map",
  // 生产环境打包优化的配置
  optimization: {
    // Tree Shaking：“标记”未引用代码
    usedExports: true,
    // 压缩代码，真正去除未引用的代码
    minimize: true,
    // 尽可能将所有模块打包到一个函数中，提升运行效率和压缩文件大小
    concatenateModules: true,
    // 提取公共模块。
    // node_modules目录下的文件默认会打包到一个单独的js中
    // 默认提取出来的文件在压缩之前大于30KB才会提取，设置minSize来设定大小
    splitChunks: { chunks: "all", minSize: 0 }
  }
};
