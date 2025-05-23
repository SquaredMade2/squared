import pkg from "@squaredmade/builder";
const { build } = pkg;

build("src/middleware/index.ts", ["hono"]);
