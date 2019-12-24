module.exports = (env, argv) => {
  if (env === 'production') {
    return require('./webpack.pro.js');
  } else {
    return require('./webpack.dev.js');
  }
}