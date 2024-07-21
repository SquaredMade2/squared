const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // other e2e configurations
  },

  component: {
    testFiles: '**/components/**/*.test.tsx',
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
