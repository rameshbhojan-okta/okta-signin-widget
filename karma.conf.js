/* global __dirname, module */

const path = require('path');
const webpackConfig = require('./webpack.test.config.js');
const karmaOverrides = require('./test/unit/karma/karma-overrides');
const rootDir = path.resolve(__dirname);

module.exports = (config) => {
  const options = {
    basePath: './',
    browsers: ['ChromeHeadlessNoSandbox'],
    frameworks: ['karma-overrides', 'jasmine-jquery', 'jasmine'],
    files: [
      './node_modules/babel-polyfill/dist/polyfill.js',
      { pattern: './test/unit/main.js', watched: false },
      { pattern: './test/unit/assets/*', watched: false, included: false, served: true, nocache: false },
    ],
    preprocessors: {
      'test/unit/main.js': ['webpack', 'sourcemap'],
    },
    plugins: [
      'karma-*',
      karmaOverrides,
    ],
    reporters: ['progress', 'junit'],
    junitReporter: {
      outputDir: `${rootDir}/build2/reports/unit`,
      outputFile: 'okta-sign-in-widget-junit-result.xml',
      useBrowserName: false,
    },
    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'html', dir: `${rootDir}/build2/reports/coverage` }
      ],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'normal',
    },
    client: {
      // Passing specific test to run
      // but this works only with `karma start`, not `karma run`.
      test: config.test,
      jasmine: {
        random: false
      }
    },
    failOnEmptyTestSuite: false,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
      },
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }

    },

  };

  // instrument code for coverage report
  if (config.reporters.includes('coverage')) {
    const rules = options.webpack.module.rules;
    const babelRule = rules.find(rule => rule.loader === 'babel-loader');
    babelRule.query.plugins = babelRule.query.plugins.concat(['babel-plugin-istanbul']);
  }

  config.set(options);
};
