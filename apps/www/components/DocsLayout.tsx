import type { ReactNode } from "react";
import { DocsSidebar } from "./DocsSidebar";

interface DocsLayoutProps {
	children: ReactNode;
	currentSlug: string;
}

export function DocsLayout({ children, currentSlug }: DocsLayoutProps) {
	return (
		<div className="flex pt-20">
			<DocsSidebar currentSlug={currentSlug} />
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
