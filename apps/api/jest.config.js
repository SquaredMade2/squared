// biome-ignore lint/style/noCommonJs: This is a js file
module.exports = {
	moduleNameMapper: {
		"^@/(.*)": "<rootDir>/src/$1",
	},
	preset: "ts-jest",
	roots: ["<rootDir>/src"],
	testEnvironment: "node",
	testMatch: ["**/?(*.)+(spec|test).ts"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
};
