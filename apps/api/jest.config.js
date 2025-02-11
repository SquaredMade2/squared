module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/?(*.)+(spec|test).ts"],
	moduleNameMapper: {
		"^@/(.*)": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
};
