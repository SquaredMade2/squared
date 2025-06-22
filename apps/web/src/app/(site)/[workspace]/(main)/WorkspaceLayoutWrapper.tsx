"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SidebarNav } from "@/components/Sidebar";
import { useViewStore } from "@/store";
import type { ViewPath } from "@/store/views";

const viewPathRegex = /\/views\/.+$/;

export default function WorkspaceLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { setLastVisitedPage } = useViewStore((state) => state);

	const isValidViewPath = (value: string) => {
		return viewPathRegex.test(value);
	};

	const getViewPath = (value: string): ViewPath => {
		const splitPath = value.split("/views");
		return splitPath.length > 1 ? `/views${splitPath[1]}` : "/views";
	};

	useEffect(() => {
		const pathMap = {
			"/active": "active",
			"/all": "all",
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
			<div className="shrink-0 transition-all duration-300 ease-in-out">
				<SidebarNav />
			</div>
			<main className="h-full w-full grow overflow-auto">{children}</main>
		</div>
	);
}
