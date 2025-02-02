import { SidebarProvider } from "@/components/ui/sidebar";
import { getPrismicDocStructure } from "@/prismic/getPrismicDocStructure";
import { createClient } from "@/prismicio";
import type { ReactNode } from "react";
import { DocSidebar } from "./DocSidebar";
import { Footer } from "./footer";

interface DocsLayoutProps {
	children: ReactNode;
}

export async function DocsLayout({ children }: DocsLayoutProps) {
	const client = createClient();
	const structure = await getPrismicDocStructure(client);

	return (
		<SidebarProvider>
			<div className="flex">
				<DocSidebar structure={structure} />
				<main className="mt-20 flex-1 overflow-y-auto">
					<div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
						{children}
					</div>
					<Footer />
				</main>
			</div>
		</SidebarProvider>
	);
}
