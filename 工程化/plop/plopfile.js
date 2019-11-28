// Plop的入口文件，需要导出一个函数
// 此函数接收一个plop对象，用于创建生成器任务
module.exports = plop => {
  // 创建一个生成器，第一个参数是生成器名称
  plop.setGenerator("component", {
    description: "",
    // 接收用户的命令行输入
    prompts: [
      {
        type: "input",
        name: "componetName",
        message: "Your component name",
        default: "myComponent"
      }
    ],
    //执行的操作
    actions: [
      {
        type: "add", //添加文件
        path: "./src/html/{{componetName}}.html", //目标目录
        templateFile: "./plop-templates/html.hbs" //模板文件,遵循hbs模板的规范
      },
      {
        type: "add",
        path: "./src/js/{{componetName}}.js",
        templateFile: "./plop-templates/js.hbs"
      }
    ]
  });
};
