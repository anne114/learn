// gulp的核心工作原理是通过管道的概念（pipe）将读取流经过加工转化为转换流，再输出到写入流
const fs = require("fs");
const { Transform } = require("stream");
exports.stream = () => {
  //文件读写流
  let read = fs.createReadStream("index.css");
  // 文件写入流
  let write = fs.createWriteStream("index.min.css");
  // 文件转化流
  const transform = new Transform({
    transform: (chunk, encoding, callback) => {
      // 核心转化过程
      // chunk是Buffer格式
      const input = chunk.toString();
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, ""); //去除空格和注释
      callback(null, output); //callback导出输出流，它是错误优先函数，没有错误，则第一个参数传null
    }
  });

  read
    .pipe(transform) //读取流转化为转化流
    .pipe(write); //转化为写入流
  return read;
};
