/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	testTimeout: 10000, // ms
	transform: {
		"^.+\\.(t|j)sx?$": "@swc/jest",
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};
