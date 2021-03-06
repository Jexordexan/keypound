const webpackConfig = require('./webpack.test.config');

module.exports = config => {
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],

    // you can define custom flags
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    frameworks: ['phantomjs-shim', 'jasmine'],
    reporters: ['spec', 'coverage', 'remap-coverage'],
    files: ['./index.js'],
    preprocessors: {
      'index.js': ['coverage', 'webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    coverageReporter: {
      type: 'in-memory',
    },
    remapCoverageReporter: {
      'text-summary': null,
      json: './test/coverage/coverage.json',
      html: './test/coverage/html',
    },
  });
};
