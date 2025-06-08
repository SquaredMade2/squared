import { execSync } from "node:child_process";
import path from "node:path";
import { build } from "@squaredmade/builder";
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
exportStatements.push("export * from '../types';");
fs.writeFileSync(
	path.join(outputDirectory, "index.ts"),
	exportStatements.join("\n"),
);

// Format the generated code with Biome
try {
	execSync("biome format --write ./components", { stdio: "inherit" });
	console.log("✅ Code formatted with Biome");
} catch (error) {
	console.error("❌ Biome formatting failed:", error);
}

build("components/index.ts", ["react", "react-dom"]);
