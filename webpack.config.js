var webpack = require('webpack');

module.exports = {

  entry: [
    'webpack/hot/only-dev-server',
    './app/main.js'
  ],

  output: {
    path: "./build",
    publicPath: "/assets/",
    filename: "bundle.js"
  },

  module: {
     loaders: [
       { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
       { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
       { test: /\.css$/, loader: "style!css" }
     ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
