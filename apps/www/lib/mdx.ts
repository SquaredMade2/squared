import fs from "node:fs";
import path from "node:path";

export function getMDXFiles(dir: string): string[] {
	const files = fs.readdirSync(dir);
	const mdxFiles = files.filter((file) => path.extname(file) === ".mdx");
	const directories = files.filter((file) =>
		fs.statSync(path.join(dir, file)).isDirectory(),
	);

	const nestedMDXFiles = directories.flatMap((directory) =>
		getMDXFiles(path.join(dir, directory)).map((file) =>
			path.join(directory, file),
		),
	);

	return [...mdxFiles, ...nestedMDXFiles];
}
