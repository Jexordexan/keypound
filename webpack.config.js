module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname,
    publicPath: '/',
    library: 'keypound',
    libraryTarget: 'umd',
    filename: "keypound.js"
  },
  module: {
    loaders: [
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