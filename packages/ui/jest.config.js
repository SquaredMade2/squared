module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "@squared-ui/react-(.+)$": "<rootDir>/src/react/$1/src",
    "@squared-ui/(.+)$": "<rootDir>/src/core/$1/src",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  setupFilesAfterEnv: [
    "<rootDir>/scripts/setup-tests.ts",
    "jest-axe/extend-expect",
  ],
};
