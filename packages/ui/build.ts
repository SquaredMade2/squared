import { $, build } from "bun";
import dts from "bun-plugin-dts";

const files = [
	"./src/accordion/index.ts",
	"./src/alert-dialog/index.ts",
	"./src/alert/index.ts",
	"./src/avatar/index.ts",
	"./src/badge/index.ts",
	"./src/button/index.ts",
	"./src/calendar/index.ts",
	"./src/card/index.ts",
	"./src/checkbox/index.ts",
	"./src/cn/index.ts",
	"./src/collapsible/index.ts",
	"./src/dialog/index.ts",
	"./src/dropdown-menu/index.ts",
	"./src/form/index.ts",
	"./src/input/index.ts",
	"./src/label/index.ts",
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

build({
	entrypoints: files,
	outdir: "dist",
	root: "./src",
	format: "esm",
	target: "bun",
	external: [
		"class-variance-authority",
		"@radix-ui/*",
		"tailwind-merge",
		"clsx",
		"@squaredmade/ui/*",
		"react",
		"react-dom",
	],
	minify: true,
	packages: "external",
	plugins: [dts()],
});
