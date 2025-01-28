import pkg from "@squared/builder";
const { build } = pkg;

const exportsList = `accordion               dismissable-layer       presence                toast
alert-dialog            dropdown-menu           primitive               toggle
arrow                   focus-guards            progress                toggle-group
avatar                  focus-scope             react-primitive         tooltip
checkbox                hover-card              rect                    use-callback-ref
collapsible             id                      roving-focus            use-controllable-state
collection              label                   scroll-area             use-escape-keydown
compose-refs            menu                    select                  use-layout-effect
context                 number                  separator               use-previous
context-menu            popover                 slot                    use-size
dialog                  popper                  switch                  visually-hidden
direction               portal                  tabs`;

try {
	const exportsArray = exportsList
		.split("\n")
		.flatMap((e) => e.split(" "))
		.filter(Boolean)
		.sort();

	for (const e of exportsArray) {
		build(`src/${e}/index.ts`, [
			"@floating-ui/react-dom",
			"aria-hidden",
			"date-fns",
			"react-remove-scroll",
		]);
	}

	console.log('"exports": {');

	for (const e of exportsArray) {
		build(`src/${e}/index.ts`, [
			"@floating-ui/react-dom",
			"aria-hidden",
			"date-fns",
			"react-remove-scroll",
		]);

		console.log(`  "./${e}": {
    "import": {
      "types": "./dist/${e}/index.d.mts",
      "default": "./dist/${e}/index.mjs"
    },
    "require": {
      "types": "./dist/${e}/index.d.ts",
      "default": "./dist/${e}/index.js"
    }
  },`);
	}

	console.log("}");
} catch (error) {
	console.error(error);
}
