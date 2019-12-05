const path = require("path");
const cwd = process.cwd();
const _ = require('lodash/fp/object');
let config = {
  author: "anne",
  title: '默认title',
  build: {
    src: "src",
    dist: 'dist',
    temp: '.tmp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**'
    }
  }
};
try {
  //在项目文件中，可以添加gulp.config.js文件，此文件为此模块配置config
  const loadConfig = require(path.join(cwd, 'gulp.config.js'))
  config = _.merge(config, loadConfig);
} catch (error) {}
module.exports = config;