require("@testing-library/jest-dom");
require("jest-extended");
require("text-encoding-polyfill");
const { toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);
const config = {
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/support/setupTests.js"],
  modulePathIgnorePatterns: ["dist"],
};
module.exports = config;
