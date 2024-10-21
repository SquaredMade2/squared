import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface MDXMetadata {
	title: string;
	description: string;
}

export interface MDXFile {
	slug: string;
	metadata: MDXMetadata;
}

export function getMDXFiles(dir: string): MDXFile[] {
	const files = fs.readdirSync(dir);
	const mdxFiles = files.filter((file) => path.extname(file) === ".mdx");
	const directories = files.filter((file) =>
		fs.statSync(path.join(dir, file)).isDirectory(),
	);

	const flattenedFiles = mdxFiles.map((file) => ({
		slug: file.replace(".mdx", ""),
		...extractMetadata(path.join(dir, file)),
	}));

	const nestedFiles = directories.flatMap((directory) =>
		getMDXFiles(path.join(dir, directory)).map((file) => ({
			...file,
			slug: `${directory}/${file.slug}`,
		})),
	);

	return [...flattenedFiles, ...nestedFiles];
}

export function extractMetadata(filePath: string): { metadata: MDXMetadata } {
	const fileContent = fs.readFileSync(filePath, "utf8");
	const { data } = matter(fileContent);
	return { metadata: data as MDXMetadata };
}
