const { src, dest, series, parallel, watch } = require("gulp");
//gulp-load-plugins模块整合了gulp下的其他模块，这样就不用去require每个gulp下的模块
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();
const del = require("del");
//创建一个本地服务器
const browserSync = require("browser-sync");
const bs = browserSync.create();
// 使用plugins，就不用引入下面的模块了
// const sass = require("gulp-sass");
// const babel = require("gulp-babel");
// const swig = require("gulp-swig");
// const imagemin = require("gulp-imagemin");

// 将src下的scss文件通过sass模块转化之后输入到dist文件：转为压缩后的css文件
// src()的第二个参数：base:src，指定了输出到dist目录时保留src中的文件路径
//sass()：如果.scss格式的文件是以“_”开头的，sass会认为这是一个代码片段，不会转化为单独的css文件
const style = async () => {
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "compressed" }))
    .pipe(dest("temp"));
};
// 将src下的js文件通过babel转化之后输入到dist文件，转化为压缩后的ES5
// babel模块只是一个提供js转化的平台，它不会对js进行转化，它唤醒了@babel/core模块对js的转化过程，
// babel()参数的presets字段指定了转化js需要的插件， @babel/preset-env，指定将ES6转化为ES5
const script = () => {
  return src("src/assets/scripts/*js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"));
};

// 将src下的html文件通过swig转化之后输入到dist文件，html可以接收data数据渲染页面
// **表示任意文件夹和文件
const data = { title: "index" };
const page = () => {
  return src("src/**/*.html", { base: "src" })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) //cache: false去除缓存
    .pipe(dest("temp"));
};
// 将src下的图片压缩转化之后输入到dist文件
const image = () => {
  return src("src/assets/images/**")
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};
// 不需要转化的资源放在public目录下，直接拷贝到dist目录下
const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist/public"));
};
// 清除dist目录
const clean = () => {
  return del(["dist", "temp"]);
};
const serve = () => {
  watch("src/assets/styles/*.scss", style); //监听源文件下的scss文件，执行style任务
  watch("src/assets/scripts/*js", script);
  watch("src/**/*.html", page);
  // watch("src/assets/images/**", image);    //在开发阶段，不需要执行image任务，多执行一个任务就会有多的性能开销，所以在开发阶段图片指向src下的文件就行
  watch(["src/assets/images/**", "public/**"], bs.reload); //files里没有包含这两个文件，所以这里使用watch，监听这两个文件夹的变化，执行页面刷新，同理，这两个文件夹应该也可以写在files里（未验证）
  bs.init({
    notify: false, //关闭页面上的“是否启动server”的提示
    port: 2080,
    // open:false,  //是否默认打开浏览器
    files: "temp/**", //当dist目录下的文件有变化时自动刷新页面
    server: {
      baseDir: ["temp", "src", "public", "."] //网站根目录,请求一个资源时，先在dist目录下找，没有再从src目录下找，"."表示根目录
    }
  });
};

// gulp-useref可以将几个文件合并到一个文件中
// 如果html文件中，引入了不会被构建包含的文件（如通过link引入了node_modules文件下的css文件），那么在构建之后该资源不会出现在dist目录中，引入资源就会404，此时可以使用gulp-useref模块将该资源构建到dist目录中
// 用法：在需要转化的地方使用注释添加标志，具体见html文件
// 创建完文件之后，可以使用gulp-htmlmin/gulp-uglify/gulp-clean-css模块分别对html/js/css文件进行压缩。
// useref模块返回的数据流中有各种类型的数据，可以使用gulp-if模块进行判断
const useref = () => {
  return src("temp/**/*.html", { base: "temp" })
    .pipe(plugins.useref({ searchPath: ["temp", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true, //压缩换行符等
          minifyCss: true, //压缩html内的css
          minifyJs: true //压缩html内的js
        })
      )
    )
    .pipe(dest("dist"));
};

const compile = parallel(style, script, page);
const build = series(clean, parallel(series(compile, useref), image, extra));
const develop = series(clean, compile, serve);
module.exports = {
  clean,
  build,
  develop
};
