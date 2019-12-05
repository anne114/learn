#!/usr/bin/env node

process.argv.push('--cwd');
process.argv.push(process.cwd());
process.argv.push("--gulpfile");
process.argv.push(require.resolve("../lib/index.js"))
require('gulp/bin/gulp'); //执行node_modules/gulp/bin/gulp.js文件