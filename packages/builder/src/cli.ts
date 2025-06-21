#!/usr/bin/env node;

import path from "node:path";
import { build } from "./index";

const [, , ...args] = process.argv;

if (args.length === 0) {
	process.exit(1);
}

const entryFile = args[0];
const relativePath = path.relative(process.cwd(), path.dirname(entryFile));

build(relativePath)
	// biome-ignore lint/suspicious/noConsole: This is a CLI so we need to use console.log
	.then(() => console.log("Build completed successfully."))
	.catch((error) => {
		// biome-ignore lint/suspicious/noConsole: This is a CLI so we need to use console.log
		console.error("Build failed:", error);
		process.exit(1);
	});
