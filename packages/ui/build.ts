import { $, type BuildConfig, build } from "bun";
import dts from "bun-plugin-dts";

const files = [
	"./src/accordion/index.ts",
	"./src/alert-dialog/index.ts",
	"./src/alert/index.ts",
	"./src/avatar/index.ts",
	"./src/badge/index.ts",
	"./src/calendar/index.ts",
	"./src/card/index.ts",
	"./src/checkbox/index.ts",
	"./src/collapsible/index.ts",
	"./src/dialog/index.ts",
	"./src/dropdown-menu/index.ts",
	"./src/form/index.ts",
	"./src/input/index.ts",
	"./src/popover/index.ts",
	"./src/select/index.ts",
	"./src/separator/index.ts",
	"./src/sheet/index.ts",
	"./src/skeleton/index.ts",
	"./src/switch/index.ts",
	"./src/table/index.ts",
	"./src/tabs/index.ts",
	"./src/textarea/index.ts",
	"./src/toast/index.ts",
	"./src/tooltip/index.ts",
];

await $`rm -rf ./dist`;
await $`bunx @tailwindcss/cli -i ./styles.css -o dist/index.css --minify`;

const config: Partial<BuildConfig> = {
	root: "./src",
	format: "esm",
	target: "browser",
	minify: true,
	packages: "external",
	plugins: [dts()],
};

build({
	...config,
	entrypoints: ["./src/cn/index.ts"],
	outdir: "./dist/cn",
	external: ["tailwind-merge", "clsx"],
	naming: "[name].[ext]",
});
build({
	...config,
	entrypoints: ["./src/label/index.ts", "./src/button/index.ts"],
	outdir: "./dist",
	external: ["tailwind-merge", "clsx"],
});
build({
	...config,
	entrypoints: files,
	outdir: "dist",
	external: [
		"class-variance-authority",
		"@radix-ui/*",
		"tailwind-merge",
		"clsx",
		"@squaredmade/ui/*",
		"react",
		"react-dom",
	],
	splitting: true,
});
