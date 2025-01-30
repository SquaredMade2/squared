import { createClient } from "@/src/prismicio";
import { components } from "@/src/slices";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page() {
	const client = createClient();
	const page = await client.getByUID("doc", "index").catch(() => notFound());

	return (
		<div className="flex flex-col w-full max-w-4xl justify-self-center">
			<SliceZone slices={page.data.slices} components={components} />
		</div>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const page = await client.getByUID("doc", "index").catch(() => notFound());

	return {
		title: page.data.meta_title,
		description: page.data.meta_description,
	};
}