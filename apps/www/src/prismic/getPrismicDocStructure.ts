import type { Client } from "@prismicio/client";

type DocPage = {
	id: string;
	uid: string;
	title: string;
	parent: string | null;
	order: number;
	children: DocPage[];
};

export async function getPrismicDocStructure(client: Client) {
	const documents = await client.getAllByType("documentation");

	const pages: DocPage[] = documents.map((doc) => ({
		children: [],
		id: doc.id,
		order: doc.data.order as number,
		parent: doc.data.parent_page?.id ?? null,
		title: doc.data.title as string,
		uid: doc.uid ?? "",
	}));

	const structure: DocPage[] = [];
	const pageMap = new Map(pages.map((page) => [page.id, page]));

	for (const page of pages) {
		if (page.parent === null) {
			structure.push(page);
		} else {
			const parentPage = pageMap.get(page.parent);
			if (parentPage) {
				parentPage.children.push(page);
			}
		}
	}

	// Sort pages and their children
	const sortPages = (p: DocPage[]) => {
		p.sort((a, b) => a.order - b.order);
		for (const page of p) {
			if (page.children.length > 0) {
				sortPages(page.children);
			}
		}
	};

	sortPages(structure);

	return structure;
}
