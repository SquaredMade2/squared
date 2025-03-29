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
		loader: {
			// Add loaders for font files
			".woff": "file",
			".woff2": "file",
			".eot": "file",
			".ttf": "file",
			".otf": "file",
		},
		// Make sure assets are copied to the output directory
		assetNames: "assets/[name]-[hash]",
	};

	await esbuild.build(esbuildConfig);
	logger.info(`Built ${path}/dist/index.js`);

	await esbuild.build({
		...esbuildConfig,
		format: "esm",
		outExtension: { ".js": ".mjs" },
	});
	logger.info(`Built ${path}/dist/index.mjs`);

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
