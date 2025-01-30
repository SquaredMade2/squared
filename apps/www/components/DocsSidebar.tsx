import { createClient } from "@/src/prismicio";
import NestedLinks, { type PageItem } from "./nested-docsidebar-links";

export const client = createClient();

export async function getAllPages() {
	const pages = await client.getAllByType("doc_sidebar_item", {
		orderings: {
			field: "my.doc_sidebar_item.order",
			direction: "asc",
		},
	});
	return pages;
}

export async function DocsSidebar() {
	const sidebarItems = await getAllPages();
	const getPageDetails = (page: PageItem): PageItem => {
		const subPages = sidebarItems
			.filter((i) => i.data.parent.id === page.id)
			.map((item) => {
				return {
					id: item.id,
					uid: item.uid,
					data: { title: item.data.title as string },
					subPages: [],
				};
			});
		return {
			id: page.id,
			uid: page.uid,
			data: { title: page.data.title },
			subPages:
				subPages.length > 0
					? subPages.map((subItem) => {
							return getPageDetails(subItem);
						})
					: [],
		};
	};

	const pages: PageItem[] = sidebarItems
		.filter((item) => !item.data.parent.id)
		.map((item) => {
			const details = {
				id: item.id,
				uid: item.uid,
				data: { title: item.data.title as string },
				subPages: [],
			};

			return getPageDetails(details);
		});

	return (
		<nav className="w-64 border-r">
			<div className="p-4">
				<NestedLinks pages={pages} />
			</div>
		</nav>
	);
}
