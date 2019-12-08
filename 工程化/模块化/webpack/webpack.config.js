const path = require('path');
module.exports = {
  //入口文件，为相对路径时，前面的./不能省略
  entry: './src/index.js',
  //打包之后的文件
  output: {
    filename: 'index.js', //打包之后的文件名
    path: path.join(__dirname, 'dist'), //path必须要是绝对路径，因此需要使用path.join()方法，得到output的绝对路径
    publicPath: 'dist/' //定义从哪个路径加载打包之后的静态资源文件，页面默认是从根目录下加载资源文件
  },
  // 打包模式：有development、production、none（不常用）三种模式，每种模式会对应地启动一些插件，如development模式会自动优化打包速度，不会压缩代码，而production模式会自动压缩代码等，这在某种程度上减少了我们的工作
  mode: 'none',
  // webpack只能打包js文件，其他资源需要使用对应的loader，该loader会将资源转化为js模块
  module: {
    // 配置打包规则，必须包含test和use字段，test：通过正则找到对应的文件类型，use：使用对应的loader加载资源
    rules: [{
        test: /.css$/,
        // use的值可以使字符串、数组、对象
        // 当需要使用多个loader时，loader的执行顺序是从后往前执行
        // css-loader是将css资源转化为js资源，style-loader是将该资源通过style标签插入到页面中
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          // url-loader通过设置limit，将小于这个大小的模块转化为ata:Urls协议的资源，而大于这个大小的，会使用file-loader将文件复制到输出目录，因此需要安装同时file-loader
          loader: 'url-loader',
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
          loader: 'babel-loader',
          // options也可以通过在根目录下创建.babelrc文件来定义
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }
      }
    ]
  }
}