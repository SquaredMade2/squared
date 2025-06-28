import type { Metadata } from "next";
import type React from "react"; // Added import for React
import { DocsLayout } from "@/components/DocsLayout";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
	description:
		"Documentation for Squared, a platform to help organize software development projects.",
	metadataBase: new URL("https://www.squaredmade.com"),
	openGraph: {
		images: ["/banner.png"],
	},
	title: "Squared Documentation",
};

export default function Layout(
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
