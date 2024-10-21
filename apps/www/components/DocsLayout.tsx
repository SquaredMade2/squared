import type { ReactNode } from "react";
import Link from "next/link";
import { getMDXFiles, type MDXFile } from "@/lib/mdx";
import path from "node:path";

interface DocsLayoutProps {
	children: ReactNode;
	currentSlug: string;
}

export function DocsLayout({ children, currentSlug }: DocsLayoutProps) {
	const mdxFiles = getMDXFiles(path.join(process.cwd(), "docs"));

	return (
		<div className="flex pt-20">
			<nav className="w-64 p-4 border-r">
				<ul>
					{mdxFiles.map((file: MDXFile) => (
						<li key={file.slug}>
							<Link
								href={`/docs/${file.slug}`}
								className={currentSlug === file.slug ? "font-bold" : ""}
							>
								{file.metadata.title || file.slug.replace(/\//g, " > ")}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
