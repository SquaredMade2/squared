"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type DocPage = {
	id: string;
	uid: string;
	title: string;
	children: DocPage[];
};

type DocSidebarProps = {
	structure: DocPage[];
};

const DocSidebarItem: React.FC<{ page: DocPage; level: number }> = ({
	page,
	level,
}) => {
	const pathname = usePathname();
	const isActive = pathname === `/docs/${page.uid}`;
	const hasChildren = page.children.length > 0;
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<li className={`pl-${level * 4}`}>
			{hasChildren ? (
				<Collapsible open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger className="flex w-full items-center py-2 text-left">
						<ChevronRight
							className={`mr-2 h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
						/>
						<span className={isActive ? "font-bold" : ""}>{page.title}</span>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<ul>
							{page.children.map((childPage) => (
								<DocSidebarItem
									key={childPage.id}
									page={childPage}
									level={level + 1}
								/>
							))}
						</ul>
					</CollapsibleContent>
				</Collapsible>
			) : (
				<Link
					href={`/docs/${page.uid}`}
					className={`block py-2 ${isActive ? "font-bold" : ""}`}
				>
					{page.title}
				</Link>
			)}
		</li>
	);
};

export const DocSidebar: React.FC<DocSidebarProps> = ({ structure }) => {
	return (
		<nav className="h-screen w-64 overflow-y-auto bg-card p-4">
			<ul>
				{structure.map((page) => (
					<DocSidebarItem key={page.id} page={page} level={0} />
				))}
			</ul>
		</nav>
	);
};
