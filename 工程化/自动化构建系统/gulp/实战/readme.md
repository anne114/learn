1、安装gulp-panda模块：yarn add gulp-panda --dev
2、yarn gulp-panda build：打包文件
3、yarn gulp-panda clean：清理打包之后的文件
4、yarn gulp-panda serve：启动本地服务，调试程序
5、通过本地项目的gulp.config.js文件导出配置信息（module.exports），以覆盖gulp-panda的默认配置信息，默认配置如下：
  let config = {
    author: "anne",
    title: '默认title',
    build: {
      src: "src",   //源文件目录
      dist: 'dist', //构建之后的文件目录
      temp: '.tmp', //临时文件目录
      public: 'public', //不需要构建的文件目录
      paths: {
        styles: 'assets/styles/*.scss',
        scripts: 'assets/scripts/*.js',
        pages: '*.html',
        images: 'assets/images/**'
      }
    }
  };
