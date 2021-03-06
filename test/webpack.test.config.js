// This is the webpack config used for unit tests.
const path = require('path');
// var utils = require('./utils')
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.config');

const webpackConfig = merge(baseConfig, {
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'src': path.resolve('src'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '"test"',
    }),
  ]
});

webpackConfig.module.loaders.push({
  enforce: 'post',
  test: /\.js$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  },
  include: path.resolve('src'),
  exclude: [
    /\.spec\.js$/,
    /node_modules/
  ]
})

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;
