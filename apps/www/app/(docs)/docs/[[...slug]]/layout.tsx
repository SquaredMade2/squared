import { DocsLayout } from "@/components/DocsLayout";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";
// app/docs/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Squared Documentation",
	description:
		"Documentation for Squared, a platform to help organize software development projects.",
	openGraph: {
		images: ["/banner.png"],
	},
};

export default async function Layout(
	props: Readonly<{
		children: ReactNode;
		params: { slug?: string[] };
	}>,
) {
	const params = await props.params;

	const { children } = props;

	const currentSlug = params.slug?.join("/") || "index";

	return (
		<>
			<NavBar />
			<DocsLayout currentSlug={currentSlug}>{children}</DocsLayout>
			<Footer />
		</>
	);
}
