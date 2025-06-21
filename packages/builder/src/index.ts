/** biome-ignore-all lint/suspicious/noConsole: This is a build script */
import "tslib";
import { join, sep } from "node:path";
import type { BuildOptions, SameShape } from "esbuild";
import { build as esbuild } from "esbuild";
import { build as tsup } from "tsup";

export async function build(path: string, external?: string[]) {
	const normalizedPath = path.split(sep).join("/");
	const file = normalizedPath;
	const dist = join("dist", normalizedPath.split("/").slice(1, -1).join("/"));

	const esbuildConfig: SameShape<BuildOptions, BuildOptions> = {
		// Make sure assets are copied to the output directory
		assetNames: "assets/[name]-[hash]",
		bundle: true,
		entryPoints: [file],
		external,
		format: "cjs",
		loader: {
			".eot": "file",
			".otf": "file",
			".ttf": "file",
			// Add loaders for font files
			".woff": "file",
			".woff2": "file",
		},
		outdir: dist,
		packages: "external",
		sourcemap: true,
		target: "es2022",
	};

	await esbuild(esbuildConfig);
	console.info(`Built ${path}/dist/index.js`);

	await esbuild({
		...esbuildConfig,
		format: "esm",
		outExtension: { ".js": ".mjs" },
	});
	console.info(`Built ${path}/dist/index.mjs`);

	await tsup({
		dts: { only: true },
		entry: [file],
		external,
		format: ["cjs", "esm"],
		outDir: dist,
		silent: true,
	});
	console.info(`Built ${path}/dist/index.d.ts`);
}
