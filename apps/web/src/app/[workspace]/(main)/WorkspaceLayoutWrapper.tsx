"use client";

import { NewTaskModal } from "@/components/Modals";
import { SidebarNav } from "@/components/Sidebar";
import { useViewStore } from "@/store";
import type { ViewPath } from "@/store/views";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { setLastVisitedPage } = useViewStore((state) => state);

	const isValidViewPath = (value: string) => {
		const regex = /\/views\/.+$/;
		return regex.test(value);
	};

	const getViewPath = (value: string): ViewPath => {
		const splitPath = value.split("/views");
		return splitPath.length > 1 ? `/views${splitPath[1]}` : "/views";
	};

	useEffect(() => {
		const pathMap = {
			"/all": "all",
			"/active": "active",
			"/backlog": "backlog",
			"/sprints/current": "sprints/current",
		} as const;
		const matchedPath = Object.keys(pathMap).find((key) =>
			pathname.endsWith(key),
		) as keyof typeof pathMap | undefined;

		if (matchedPath) {
			setLastVisitedPage(pathMap[matchedPath]);
		} else if (isValidViewPath(pathname)) {
			setLastVisitedPage(getViewPath(pathname));
		}
	}, [pathname, setLastVisitedPage]);

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<div className="flex-shrink-0 transition-all duration-300 ease-in-out">
				<SidebarNav />
			</div>
			<main className="h-full w-full flex-grow overflow-auto">
				<NewTaskModal />
				{children}
			</main>
		</div>
	);
}
