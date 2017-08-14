const webpackConfig = require('./webpack.test.config');

module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['phantomjs-shim', 'jasmine'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      'index.js': ['coverage', 'webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' },
      ],
    },
  });
};
