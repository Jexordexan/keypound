module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname,
    publicPath: '/',
    library: 'keypound',
    libraryTarget: 'umd',
    filename: "keypound.js"
  },
  devtool: '#cheap-module-eval-source-map',
  module: {
    loaders: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  }
};
