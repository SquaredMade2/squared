import { DocsLayout } from "@/components/DocsLayout";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";
// app/docs/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Squared Documentation",
	description:
		"Documentation for Squared, a platform to help organize software development projects.",
	openGraph: {
		images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
	},
};

export default async function Layout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { slug?: string[] };
}>) {
	const team = await params;
	console.log(team); // Выводим params, чтобы увидеть, что в нем содержится

	const currentSlug =
		params.slug && params.slug.length > 0 ? params.slug.join("/") : "index"; // Если пустой, то fallback на "index"

	console.log(currentSlug); // Проверяем значение currentSlug
	return (
		<>
			<NavBar />
			<DocsLayout currentSlug={currentSlug}>{children}</DocsLayout>
			<Footer />
		</>
	);
}
