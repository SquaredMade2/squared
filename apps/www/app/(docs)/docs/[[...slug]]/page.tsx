import fs from "node:fs";
import path from "node:path";
import { type MDXMetadata, extractMetadata } from "@/lib/mdx";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata(props: PageProps): Promise<MDXMetadata> {
	const params = await props.params;
	const slug = params.slug?.join("/") || "index";
	const filePath = path.join(process.cwd(), "docs", `${slug}.mdx`);
	const { metadata } = extractMetadata(filePath);
	return metadata;
}

const Page = async (props: PageProps) => {
	const params = await props.params;
	const slug = params.slug?.join("/") || "index";
	const filePath = path.join(process.cwd(), "docs", `${slug}.mdx`);

	if (!fs.existsSync(filePath)) {
		return <div>404 - Page not found</div>;
	}

	const fileContent = fs.readFileSync(filePath, "utf8");
	const { data: metadata, content } = matter(fileContent);

	return (
		<div className="markdown-content">
			<h1>{metadata.title}</h1>
			<p className="text-gray-600 mb-4">{metadata.description}</p>
			<hr className="my-4 border-t border-gray-300" />
			<MDXRemote source={content} />
		</div>
	);
};

export default Page;
