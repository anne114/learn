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
const config = require('./config');
const _b = config.build;
const style = () => {
  return src(_b.paths.styles, {
      base: _b.src,
      cwd: _b.src //表示从哪个文件下去寻找文件，默认是命令行中的目录
    })
    .pipe(plugins.sass({
      outputStyle: "compressed"
    }))
    .pipe(dest(_b.temp));
};
const script = () => {
  return src(_b.paths.scripts, {
      base: _b.src,
      cwd: _b.src
    })
    .pipe(plugins.babel({
      presets: [require("@babel/preset-env")]
    }))
    .pipe(dest(_b.temp));
};
const page = () => {
  return src(_b.paths.pages, {
      base: _b.src,
      cwd: _b.src
    })
    .pipe(plugins.swig({
      data: config,
      defaults: {
        cache: false
      }
    }))
    .pipe(dest(_b.temp));
};
const image = () => {
  return src(_b.paths.images, {
      base: _b.src,
      cwd: _b.src
    })
    .pipe(plugins.imagemin())
    .pipe(dest(_b.dist));
};
const extra = () => {
  return src("**", {
    base: _b.public,
    cwd: _b.public
  }).pipe(dest(`${_b.dist}/${_b.public}`));
};
const clean = () => {
  return del([_b.dist, _b.temp]);
};
const cleanTemp = () => {
  return del(_b.temp);
}
const serve = () => {
  watch(_b.styles, {
    cwd: _b.src
  }, style); //监听源文件下的scss文件，执行style任务
  watch(_b.scripts, {
    cwd: _b.src
  }, script);
  watch(_b.page, {
    cwd: _b.src
  }, page);

  watch(_b.paths.image, {
    cwd: _b.src
  }, bs.reload);
  watch("**", {
    cwd: _b.public
  }, bs.reload);
  bs.init({
    notify: false,
    port: 2080,
    files: _b.temp + "/**",
    server: {
      baseDir: [_b.temp, _b.dist, _b.src, _b.public, "."]
    }
  });
};
const useref = () => {
  return src("*.html", {
      base: _b.temp,
      cwd: _b.temp
    })
    .pipe(plugins.useref({
      searchPath: [_b.temp, "."]
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
    .pipe(dest(_b.dist));
};

const compile = parallel(style, script, page);
const build = series(clean, parallel(series(compile, useref, cleanTemp), image, extra));
const develop = series(clean, compile, serve);
module.exports = {
  clean,
  build,
  develop
};