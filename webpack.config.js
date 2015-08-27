module.exports = {
  entry: {
    app: ["./app/main.js"]
  },
  output: {
    path: "./build",
    publicPath: "/assets/",
    filename: "bundle.js"
  }
};
