import { globSync } from "glob";
export const getSvgPaths = () => {
	const svgs = globSync("*.svg", { cwd: "./svgs" });
	const filePaths = svgs.map((path: string) => `./svgs/${path}`);
	const iconNames = svgs.map((fileName) =>
		fileName.slice(0, fileName.length - 4),
	);
	return [iconNames, filePaths];
};
