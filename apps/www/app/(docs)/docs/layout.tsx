// app/docs/layout.tsx
import type { Metadata } from "next";
import { DocsLayout } from "@/components/DocsLayout";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
	title: "Squared Documentation",
	description:
		"Documentation for Squared, a platform to help organize software development projects.",
	openGraph: {
		images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
	},
};

export default function Layout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { slug?: string[] };
}>) {
	const currentSlug = params.slug?.join("/") || "index";

	return (
		<>
			<NavBar />
			<DocsLayout currentSlug={currentSlug}>{children}</DocsLayout>
			<Footer />
		</>
	);
}
