module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
	moduleNameMapper: {
		"^@/(.*)": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	globalSetup: "<rootDir>/jest.setup.ts",
	globalTeardown: "<rootDir>/jest.teardown.ts",
};
