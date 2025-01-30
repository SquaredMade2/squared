import { createClient } from "@/src/prismicio";
import { components } from "@/src/slices";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
	const { uid } = await params;
	const client = createClient();
	const page = await client.getByUID("doc", uid).catch(() => notFound());

	return (
		<div className="flex flex-col w-full max-w-[50vw] justify-self-center">
			<SliceZone slices={page.data.slices} components={components} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const page = await client.getByUID("doc", uid).catch(() => notFound());

	return {
		title: page.data.meta_title,
		description: page.data.meta_description,
	};
}

export async function generateStaticParams() {
	const client = createClient();
	const pages = await client.getAllByType("doc");

	return pages.map((page) => {
		return { uid: page.uid };
	});
}
