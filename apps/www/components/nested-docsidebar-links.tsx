"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export interface PageItem {
	id: string;
	uid: string;
	data: {
		title: string;
	};
	subPages: PageItem[] | [];
}
export interface SidebarProps {
	pages: PageItem[];
}

export default function NestedLinks({ pages }: SidebarProps) {
	const params = useParams();
	const renderPageItem = (page: PageItem) => {
		if (page.subPages.length > 0) {
			return (
				<Accordion
					key={page.uid}
					type="single"
					collapsible
					className="w-full space-y-3"
				>
					<AccordionItem value={page.id} className="border-none">
						<AccordionTrigger className="py-3 hover:no-underline">
							{page.data.title}
						</AccordionTrigger>
						<AccordionContent>
							{page.subPages.map(renderPageItem)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			);
		}
			return (
				<Link
					key={page.uid}
					className={cn(
						"flex w-full py-3",
						params?.uid === page.uid &&
							"font-medium text-blue-600 dark:text-blue-400",
					)}
					href={`/docs/${page.uid !== "index" && page.uid}`}
				>
					{page.data.title}
				</Link>
			);
	};

	return <div>{pages.map(renderPageItem)}</div>;
}
