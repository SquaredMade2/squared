// import path from "node:path";
import {
	Accordion,
	// AccordionContent,
	// AccordionItem,
	// AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { type MDXFile, getMDXFiles } from "@/lib/mdx";
// import { cn } from "@/lib/utils";
import { createClient } from "@/src/prismicio";
import { components } from "@/src/slices";
import { SliceZone } from "@prismicio/react";
// import Link from "next/link";
import { notFound } from "next/navigation";


interface DocsSidebarProps {
	currentSlug: string;
}

// interface NestedItem extends MDXFile {
// 	children: Record<string, NestedItem>;
// }

// const customOrder = [
// 	"index",
// 	"quick-start",
// 	"sign-up",
// 	"manage-your-team",
// 	"managing-tasks",
// 	"task-management-best-practices",
// 	"managing-your-account",
// 	"teams-collaborate",
// 	"faq",
// ];

// function organizeFiles(files: MDXFile[]): NestedItem[] {
// 	const fileMap: Record<string, NestedItem> = {};

// 	for (const file of files) {
// 		const parts = file.slug.split("/");
// 		let currentLevel: Record<string, NestedItem> = fileMap;

// 		for (let i = 0; i < parts.length; i++) {
// 			const part = parts[i];
// 			const currentPath = parts.slice(0, i + 1).join("/");

// 			if (!currentLevel[currentPath]) {
// 				currentLevel[currentPath] = {
// 					...file,
// 					slug: currentPath,
// 					metadata: { ...file.metadata, title: file.metadata.title || part },
// 					children: {},
// 				};
// 			}

// 			if (i < parts.length - 1) {
// 				currentLevel = currentLevel[currentPath].children;
// 			}
// 		}
// 	}

	// function sortFilesByCustomOrder(
	// 	files: NestedItem[],
	// 	customOrder: string[],
	// ): NestedItem[] {
	// 	return files
	// 		.sort((a, b) => {
	// 			const indexA = customOrder.indexOf(a.slug.split("/").pop() || "");
	// 			const indexB = customOrder.indexOf(b.slug.split("/").pop() || "");

	// 			if (indexA === -1 && indexB === -1) {
	// 				return a.metadata.title.localeCompare(b.metadata.title);
	// 			}
	// 			if (indexA === -1) return 1;
	// 			if (indexB === -1) return -1;
	// 			return indexA - indexB;
	// 		})
	// 		.map((file) => ({
	// 			...file,
	// 			children: Object.fromEntries(
	// 				sortFilesByCustomOrder(Object.values(file.children), customOrder).map(
	// 					(child) => [child.slug, child],
	// 				),
	// 			),
	// 		}));
	// }

	// return sortFilesByCustomOrder(Object.values(fileMap), customOrder);
// }

// function NestedLinks({
// 	items,
// 	currentSlug,
// }: {
// 	items: NestedItem[];
// 	currentSlug: string;
// }) {
// 	return (
// 		<Accordion type="multiple" className="w-full">
// 			{items.map((item) => (
// 				<AccordionItem
// 					value={item.slug}
// 					key={item.slug}
// 					className="border-none"
// 				>
// 					{Object.keys(item.children).length > 0 ? (
// 						<AccordionTrigger className="hover:no-underline">
// 							{item.metadata.title}
// 						</AccordionTrigger>
// 					) : (
// 						<Link
// 							href={`/docs/${item.slug}`}
// 							className={cn(
// 								"flex w-full py-4",
// 								currentSlug === item.slug &&
// 									"font-medium text-blue-600 dark:text-blue-400",
// 							)}
// 						>
// 							{item.metadata.title}
// 						</Link>
// 					)}
// 					{Object.keys(item.children).length > 0 && (
// 						<AccordionContent>
// 							<div className="ml-4">
// 								<NestedLinks
// 									items={Object.values(item.children)}
// 									currentSlug={currentSlug}
// 								/>
// 							</div>
// 						</AccordionContent>
// 					)}
// 				</AccordionItem>
// 			))}
// 		</Accordion>
// 	);
// }

export async function DocsSidebar({ currentSlug }: DocsSidebarProps) {
	// const mdxFiles = getMDXFiles(path.join(process.cwd(), "docs"));
	// const organizedFiles = organizeFiles(mdxFiles);
	const client = createClient();
	const sidebar = await client.getSingle("doc_sidebar",{
		'fetchLinks': "child_accordion.accordion_trigger,child_accordion.accordion_content" 
	}).catch(() => notFound());

	return (
		<nav className="w-64 border-r">
			<ScrollArea className="h-[calc(100vh-5rem)]">
				<div className="p-4">
					<Accordion type="multiple" className="w-full">
						<SliceZone slices={sidebar.data.slices} components={components} />
					</Accordion>
					{/* <NestedLinks items={organizedFiles} currentSlug={currentSlug} /> */}
				</div>
			</ScrollArea>
		</nav>
	);
}
