// --gulp的入口文件
// --使用exports导出gulp的任务，可以在命令行中使用“yarn gulp 任务名”执行任务，不输入任务名时，默认调用default任务
// --gulp中的任务都是异步任务，因此需要使用以下几种方法来表明任务已结束：
// 1.通过执行回调函数
// 2.通过promise，任务完成时，使用return Promise.resolve();
// 3.使用async...await
// 4.通过stream流的方式，return一个stream对象，stream执行完成后会调用自身的end方法，以表明任务结束了
// --串行任务和并行任务：使用gulp的series, parallel方法

const fs = require("fs");
// series表示串行任务，parallel表示并行任务
const { series, parallel } = require("gulp");
// 通过执行回调函数表明任务结束
exports.html = done => {
  done();
  // done(new Error('task fail'));    //如果任务失败，则给done传一个错误对象
};
// 通过return Promise.resolve()表明任务结束
exports.css = () => {
  return Promise.resolve();
  // return Promise.reject();  //表示任务失败
};
function timeout() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
// 使用async...await表明任务结束
exports.js = async () => {
  await timeout();
};
// 使用stream流来表明任务结束
exports.stream = () => {
  // 创建一个读取文件的文件流
  let readStream = fs.createReadStream("index.css");
  // 创建一个写入文件的文件流
  let writeStream = fs.createWriteStream("index.min.css");
  // 读取文件流写入 写入文件流中
  readStream.pipe(writeStream);
  // return readStream时，会执行readStream的end方法，以表明任务结束
  return readStream;
  // 所以return与下面的代码效果是一样的
  // readStream.on('end',() => {
  //   done()    //stream方法需要传入done参数
  // })
};

//串行任务
exports.seriesTask = series(html, js);
exports.parallelTask = parallel(css, stream);
