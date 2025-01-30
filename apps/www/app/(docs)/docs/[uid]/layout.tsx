import { DocsLayout } from "@/components/DocsLayout";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";
import type { Metadata } from "next";

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
		children: React.ReactNode;
		params: { slug?: string[] };
	}>,
) {

	const { children } = props;

	return (
		<>
			<NavBar />
			<DocsLayout>{children}</DocsLayout>
			<Footer />
		</>
	);
}
