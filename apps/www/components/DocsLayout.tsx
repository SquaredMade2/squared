import { getPrismicDocStructure } from "@/prismic/getPrismicDocStructure";
import { createClient } from "@/prismicio";
import type { ReactNode } from "react";
import { DocSidebar } from "./DocsSidebar";

interface DocsLayoutProps {
	children: ReactNode;
}

export async function DocsLayout({ children }: DocsLayoutProps) {
	const client = createClient();
	const structure = await getPrismicDocStructure(client);
	return (
		<div className="flex pt-20">
			<DocSidebar structure={structure} />
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
