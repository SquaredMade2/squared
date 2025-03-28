import pkg from "@squaredmade/builder";
const { build } = pkg;

build("src/index.ts", [
	"express",
	"@squaredmade/context",
	"@squaredmade/logger",
	"zod",
]);
