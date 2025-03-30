import pkg from "@squaredmade/builder";
const { build } = pkg;

build("src/index.ts", ["@neondatabase/serverless", "drizzle-orm", "ws"]);
