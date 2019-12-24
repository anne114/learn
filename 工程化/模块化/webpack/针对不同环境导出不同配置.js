module.exports = (env, argv) => {
  // env,接收命令行的环境变量，yarn webpack --env production
  // argv,接收命令行的所以变量
  // config=通用配置
  let config = {
    // webpack相关配置
  }
  if (env === 'production') {
    // 如果是生产环境，配置其特有的特性
    config.devServer = false;
    // ....
  }
  return config;
}