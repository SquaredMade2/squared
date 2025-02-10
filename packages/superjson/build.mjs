import pkg from "@squared/builder";
const { build } = pkg;

build("src/index.ts", ["@squared/copy"]);
