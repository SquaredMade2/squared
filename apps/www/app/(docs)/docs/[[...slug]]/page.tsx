import fs from "node:fs";
import path from "node:path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { DocsLayout } from "@/components/DocsLayout";

const Page = async ({ params }: { params: { slug?: string[] } }) => {
	const slug = params.slug?.join("/") || "index";
	const filePath = path.join(process.cwd(), "docs", `${slug}.mdx`);

	if (!fs.existsSync(filePath)) {
		return <div>404 - Page not found</div>;
	}

	const content = fs.readFileSync(filePath, "utf8");

	return (
		<DocsLayout>
			<div className="markdown-content">
				<MDXRemote source={content} />
			</div>
		</DocsLayout>
	);
};

export default Page;
