import { getPrismicDocStructure } from "@/prismic/getPrismicDocStructure";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Documentation | Your Project Name",
	description:
		"Explore our comprehensive documentation to get started with Your Project Name.",
};

export default async function DocsLandingPage() {
	const client = createClient();
	const page = await client.getSingle("docs");
	const structure = await getPrismicDocStructure(client);

	return (
		<div className="mx-auto max-w-4xl py-12">
			<h1 className="mb-6 font-bold text-4xl">{page.data.title}</h1>
			<div className="prose mb-12 max-w-none">
				<PrismicRichText
					field={page.data.introduction}
					components={{
						paragraph: ({ children }) => (
							<p className="mb-4 text-muted-foreground">{children}</p>
						),
					}}
				/>
			</div>

			<h2 className="mb-4 font-semibold text-2xl">Documentation Sections</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{structure.map((section) => (
					<Link
						key={section.id}
						href={`/docs/${section.uid}`}
						className="block rounded-lg border p-6 transition-shadow hover:shadow-md"
					>
						<h3 className="mb-2 font-semibold text-xl">{section.title}</h3>
						{section.children.length > 0 && (
							<ul className="list-inside list-disc">
								{section.children.slice(0, 3).map((subSection) => (
									<li key={subSection.id}>{subSection.title}</li>
								))}
								{section.children.length > 3 && <li>...</li>}
							</ul>
						)}
					</Link>
				))}
			</div>
		</div>
	);
}
