const {
  src,
  dest,
  series,
  parallel,
  watch
} = require("gulp");
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();
const del = require("del");
const browserSync = require("browser-sync");
const bs = browserSync.create();
const data = {
  title: "index"
};
const style = async () => {
  return src("src/assets/styles/*.scss", {
      base: "src"
    })
    .pipe(plugins.sass({
      outputStyle: "compressed"
    }))
    .pipe(dest("temp"));
};
const script = () => {
  return src("src/assets/scripts/*js", {
      base: "src"
    })
    .pipe(plugins.babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(dest("temp"));
};
const page = () => {
  return src("src/**/*.html", {
      base: "src"
    })
    .pipe(plugins.swig({
      data,
      defaults: {
        cache: false
      }
    })) //cache: false去除缓存
    .pipe(dest("temp"));
};
const image = () => {
  return src("src/assets/images/**", {
      base: "src"
    })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};
const extra = () => {
  return src("public/**", {
    base: "public"
  }).pipe(dest("dist/public"));
};
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
const useref = () => {
  return src("temp/*.html", {
      base: "temp"
    })
    .pipe(plugins.useref({
      searchPath: ["temp", "."]
    }))
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