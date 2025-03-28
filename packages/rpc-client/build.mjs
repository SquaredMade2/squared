import pkg from "@squaredmade/builder";
const { build } = pkg;

build("src/index.ts", [
	"axios",
	"@squaredmade/context",
	"@squaredmade/superjson",
]);
