import path from "node:path";
import fs from "fs-extra";
import { globSync } from "glob";
import createSquaredIcon from "./createSquaredIcon";
import handleComponentName from "./handleComponentName";

const inputDirectory = "./svgs";
const outputDirectory = "./components";

const svgFiles = globSync("*.svg", { cwd: inputDirectory });

if (!fs.existsSync(outputDirectory)) {
	fs.mkdirSync(outputDirectory);
}
const exportStatements: string[] = [];
for (const file of svgFiles) {
	const svgContent = fs.readFileSync(
		`${path.join(inputDirectory, file)}`,
		"utf8",
	);
	const componentName = handleComponentName(path.basename(file, ".svg"));
	const reactComponent = createSquaredIcon(componentName, svgContent);
	fs.writeFileSync(
		path.join(outputDirectory, `${componentName}.tsx`),
		reactComponent,
	);
	exportStatements.push(`export * from './${componentName}'; `);
}
fs.writeFileSync(
	path.join(outputDirectory, "index.ts"),
	exportStatements.join("\n"),
);
