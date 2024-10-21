import type { ReactNode } from "react";
import Link from "next/link";
import { getMDXFiles } from "@/lib/mdx";
import path from "node:path";

interface DocsLayoutProps {
	children: ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
	const mdxFiles = getMDXFiles(path.join(process.cwd(), "docs"));

	return (
		<div className="flex">
			<nav className="w-64 p-4 border-r">
				<ul>
					{mdxFiles.map((file) => (
						<li key={file}>
							<Link href={`/docs/${file.replace(".mdx", "")}`}>
								{file.replace(".mdx", "").replace(/\//g, " > ")}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
