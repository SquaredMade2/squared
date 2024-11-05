#!/usr/bin/env node
import path from "node:path";
import { build } from "./index";

const [, , ...args] = process.argv;

if (args.length === 0) {
	console.error("Please provide a path to the entry file.");
	process.exit(1);
}

const entryFile = args[0];
const relativePath = path.relative(process.cwd(), path.dirname(entryFile));

build(relativePath)
	.then(() => console.log("Build completed successfully."))
	.catch((error) => {
		console.error("Build failed:", error);
		process.exit(1);
	});
