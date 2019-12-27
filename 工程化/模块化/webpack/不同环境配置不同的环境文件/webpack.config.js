module.exports = (env, argv) => {
  console.log("env::", env);
  if (env === "production") {
    return require("./webpack.pro.js");
  } else {
    return require("./webpack.dev.js");
  }
};
