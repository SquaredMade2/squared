import { components } from "@/prismic/slices";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { uid: string };

export default async function DocPage(props: { params: Promise<Params> }) {
	const params = await props.params;
	const client = createClient();
	const page = await client
		.getByUID("documentation", params.uid)
		.catch(() => notFound());

	return (
		<article className="mx-auto max-w-3xl py-8">
			<h1 className="mb-6 font-bold text-4xl">{page.data.title}</h1>
			<SliceZone slices={page.data.slices} components={components} />
		</article>
	);
}

export async function generateMetadata(props: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const params = await props.params;
	const client = createClient();
	const page = await client
		.getByUID("documentation", params.uid)
		.catch(() => notFound());

	return {
		title: page.data.title,
		description: page.data.meta_description,
	};
}

export async function generateStaticParams() {
	const client = createClient();
	const pages = await client.getAllByType("documentation");

	return pages.map((page) => ({
		uid: page.uid,
	}));
}
