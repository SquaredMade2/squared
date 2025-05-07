import { DocsLayout } from "@/components/DocsLayout";
import { NavBar } from "@/components/navbar";
import type { Metadata } from "next";
import type React from "react"; // Added import for React

export const metadata: Metadata = {
	metadataBase: new URL("https://www.squaredmade.com"),
	title: "Squared Documentation",
	description:
		"Documentation for Squared, a platform to help organize software development projects.",
	openGraph: {
		images: ["/banner.png"],
	},
};

export default async function Layout(
	props: Readonly<{
		children: React.ReactNode;
		params: { slug?: string[] };
	}>,
) {
	const { children } = props;

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />
			<div className="grow">
				<DocsLayout>{children}</DocsLayout>
			</div>
		</div>
	);
}
