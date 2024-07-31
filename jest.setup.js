require("@testing-library/jest-dom");
require("jest-extended");
require("text-encoding-polyfill");
const { toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);
