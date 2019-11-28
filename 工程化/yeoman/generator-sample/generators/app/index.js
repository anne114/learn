//此文件是Generator的核心入口文件
//需要导出一个继承自yeomanGenerator的类
// Yeoman Generator在工作时会自动调用我们在此类型中定义的一些生命周期
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入
const path = require("path");
const Generator = require("yeoman-generator");
const getFilePath = require(path.join(
  __filename,
  "../../../utils/getFilePath.js"
));
let tempPath = path.join(__filename, "../templates/");
module.exports = class extends Generator {
  // 以命令行询问的方式向用户发出询问
  // 在此方法中可以调用父方法的prompt()方法，发出对用户的命令行询问
  promption() {
    return this.prompt([
      {
        type: "input",
        name: "name", //key值为name
        message: "Your project name", //提示文字
        default: this.appname //appname为项目生成目录的文件夹的名字
      },
      {
        type: "input",
        name: "author",
        message: "please input author",
        default: "anne"
      }
    ]).then(answers => {
      this.answers = answers; //answers为用户在命令行输入的答案
      console.log(answers);
    });
  }
  // 将模板文件写入到其他文件中，模板文件只能放在template文件中
  // 模板文件采用EJS的格式
  writing() {
    let temps = new getFilePath(tempPath).files;
    temps.forEach(temp => {
      this.fs.copyTpl(
        this.templatePath(temp),
        this.destinationPath(temp),
        this.answers
      );
    });
  }
};
