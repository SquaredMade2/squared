"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "@squaredmade/icons";
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

	if (hasChildren) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						asChild
						className="w-full justify-between"
						isActive={isActive}
					>
						<Link
							href={`/docs/${page.uid}`}
							className="flex w-full items-center justify-between"
						>
							{page.title}
							<ChevronDown
								className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
							/>
						</Link>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{page.children.map((childPage) => (
							<DocSidebarItem
								key={childPage.id}
								page={childPage}
								level={level + 1}
							/>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<SidebarMenuSubItem>
			<SidebarMenuSubButton asChild isActive={isActive}>
				<Link
					href={`/docs/${page.uid}`}
					className={`h-fit ${isActive && "bg-accent text-accent-foreground"} w-full`}
				>
					{page.title}
				</Link>
			</SidebarMenuSubButton>
		</SidebarMenuSubItem>
	);
};

export const DocSidebar: React.FC<DocSidebarProps> = ({ structure }) => {
	return (
		<Sidebar className="mt-[5rem] h-[calc(100vh-5rem)] border-r bg-background">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Documentation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{structure.map((page) => (
								<SidebarMenuItem key={page.id}>
									<DocSidebarItem page={page} level={0} />
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
