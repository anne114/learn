gulp 实战：
1、将 scss 的文件转为 css，并进行压缩
2、将 ES6 及以上版本的 js 文件通过 babel 转化为 ES5 文件
3、压缩 html 文件
4、压缩图片

使用步骤：
1、yarn add gulp --dev
2、新建 gulpfile.js 文件
3、在命令行中执行“yarn gulp 任务名”，任务名为 gulpfile.js 文件中通过 exports 导出的函数，也可以省略任务名，默认为执行 default 任务
