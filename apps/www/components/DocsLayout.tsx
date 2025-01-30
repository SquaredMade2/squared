import type { ReactNode } from "react";
import { DocsSidebar } from "./DocsSidebar";

interface DocsLayoutProps {
	children: ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
	return (
		<div className="flex pt-20">
			<DocsSidebar  />
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
