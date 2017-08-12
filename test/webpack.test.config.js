// This is the webpack config used for unit tests.
var path = require('path')
// var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('../webpack.config')

var webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  resolve: {
    alias: {
      'src': path.resolve('src')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '"testing"'
    })
  ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
