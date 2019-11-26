const fs = require("fs");
const path = require("path");
module.exports = class GetFilePath {
  constructor(temp, basicPath = "") {
    this.temp = temp;
    this.basicPath = basicPath;
    this.files = [];
    this.getFile();
  }
  getFile() {
    let files = fs.readdirSync(this.temp);
    files.forEach(file => {
      var new_path = `${this.temp}\\${file}`;
      var stat = fs.statSync(new_path); //要检查是否为文件夹，需获取stat对象
      let isDirectory = stat.isDirectory(); //是否是目录
      if (isDirectory) {
        let newFile = new GetFilePath(
          `${new_path}\\`,
          `${this.basicPath}${file}\\`
        );
        this.files.push(...newFile.files);
      } else {
        this.files.push(this.basicPath + file);
      }
    });
  }
};
