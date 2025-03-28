import "tslib";
import { join, sep } from "node:path";
import createCustomLogger from "@squaredmade/logger";
import type { BuildOptions, SameShape } from "esbuild";
import * as esbuild from "esbuild";
import * as tsup from "tsup";

const logger = createCustomLogger("builder");

export async function build(path: string, external?: string[]) {
	const normalizedPath = path.split(sep).join("/");
	const file = normalizedPath;
	const dist = join("dist", normalizedPath.split("/").slice(1, -1).join("/"));

	const esbuildConfig: SameShape<BuildOptions, BuildOptions> = {
		entryPoints: [file],
		packages: "external",
		external,
		bundle: true,
		sourcemap: true,
		format: "cjs",
		target: "es2022",
		outdir: dist,
	};

	await esbuild.build(esbuildConfig);
	logger.info(`Built ${path}/dist/index.js`);

	await esbuild.build({
		...esbuildConfig,
		format: "esm",
		outExtension: { ".js": ".mjs" },
	});
	logger.info(`Built ${path}/dist/index.mjs`);

	// tsup is used to emit d.ts files only (esbuild can't do that).
	//
	// Notes:
	// 1. Emitting d.ts files is super slow for whatever reason.
	// 2. It could have fully replaced esbuild (as it uses that internally),
	//    but at the moment its esbuild version is somewhat outdated.
	//    It’s also harder to configure and esbuild docs are more thorough.
	await tsup.build({
		entry: [file],
		format: ["cjs", "esm"],
		dts: { only: true },
		outDir: dist,
		silent: true,
		external,
	});
	logger.info(`Built ${path}/dist/index.d.ts`);
}

export default build;
