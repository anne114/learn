// 清除打包后的js文件中的注释
module.exports = class cleanNote {
  //调用plugin时自动执行apply方法，接收compiler参数（webpack对象，通过compiler.hooks获取webpack的钩子）
  apply(compiler) {
    // emit钩子是在webpack即将将打包好的文件写入输出文件时的钩子
    // 通过tap方法定义插件名和插件执行函数,compilation参数可以理解为此次打包上下文，通过它可获取输出的文件名和文件内容
    compiler.hooks.emit.tap('cleanNote', compilation => {
      // compilation.assets获取输出的所有文件
      for (const name in compilation.assets) {
        if (name.endsWith('.js')) {
          // 通过source()方法获取文件内容
          const content = compilation.assets[name].source();
          const withoutNote = content.replace(/\/\*\*+\*\//g, '');
          // webpack规定通过定义compilation.assets[name]对象的source方法和size方法来返回修改之后的内容
          compilation.assets[name] = {
            source: () => withoutNote,
            size: () => withoutNote.length
          }
        }
      }

    })
  }
}