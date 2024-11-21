import path from "node:path";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type MDXFile, getMDXFiles } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DocsSidebarProps {
	currentSlug: string;
}

interface NestedItem extends MDXFile {
	children: Record<string, NestedItem>;
}

function organizeFiles(files: MDXFile[]): NestedItem[] {
	const fileMap: Record<string, NestedItem> = {};

	for (const file of files) {
		const parts = file.slug.split("/");
		let currentLevel: Record<string, NestedItem> = fileMap;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const currentPath = parts.slice(0, i + 1).join("/");

			if (!currentLevel[currentPath]) {
				currentLevel[currentPath] = {
					...file,
					slug: currentPath,
					metadata: { ...file.metadata, title: file.metadata.title || part },
					children: {},
				};
			}

			if (i < parts.length - 1) {
				currentLevel = currentLevel[currentPath].children;
			}
		}
	}

	function arrayToRecord(items: NestedItem[]): Record<string, NestedItem> {
		return items.reduce(
			(acc, item) => {
				acc[item.slug] = item;
				return acc;
			},
			{} as Record<string, NestedItem>,
		);
	}

	function sortFiles(files: Record<string, NestedItem>): NestedItem[] {
		return Object.values(files)
			.sort((a, b) => a.slug.localeCompare(b.slug))
			.map((file) => ({
				...file,
				children: arrayToRecord(sortFiles(file.children)),
			}));
	}

	return sortFiles(fileMap);
}

function NestedLinks({
	items,
	currentSlug,
}: {
	items: NestedItem[];
	currentSlug: string;
}) {
	return (
		<Accordion type="multiple" className="w-full">
			{items.map((item) => (
				<AccordionItem
					value={item.slug}
					key={item.slug}
					className="border-none"
				>
					{Object.keys(item.children).length > 0 ? (
						<AccordionTrigger className="hover:no-underline">
							{item.metadata.title}
						</AccordionTrigger>
					) : (
						<Link
							href={`/docs/${item.slug}`}
							className={cn(
								"flex w-full py-4",
								currentSlug === item.slug &&
									"font-medium text-blue-600 dark:text-blue-400",
							)}
						>
							{item.metadata.title}
						</Link>
					)}
					{Object.keys(item.children).length > 0 && (
						<AccordionContent>
							<div className="ml-4">
								<NestedLinks
									items={Object.values(item.children)}
									currentSlug={currentSlug}
								/>
							</div>
						</AccordionContent>
					)}
				</AccordionItem>
			))}
		</Accordion>
	);
}

export function DocsSidebar({ currentSlug }: DocsSidebarProps) {
	const mdxFiles = getMDXFiles(path.join(process.cwd(), "docs"));
	const organizedFiles = organizeFiles(mdxFiles);

	return (
		<nav className="w-64 border-r">
			<ScrollArea className="h-[calc(100vh-5rem)]">
				<div className="p-4">
					<NestedLinks items={organizedFiles} currentSlug={currentSlug} />
				</div>
			</ScrollArea>
		</nav>
	);
}
