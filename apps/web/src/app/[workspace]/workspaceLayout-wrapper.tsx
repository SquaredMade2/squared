"use client";

import { SidebarNav } from "@/components/Sidebar";
import { useViewStore } from "@/store";
import type { ViewPath } from "@/store/views";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceLayoutWrapper({
	children,
}: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { setLastVisitedPage } = useViewStore((state) => state);
	// Check if we're in a subdirectory
	const isSubdirectory = pathname.split("/").filter(Boolean).length > 3;

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
	}, [pathname]);

	return (
		<div className="flex w-full overflow-hidden relative">
			{isSubdirectory && <SidebarNav />}
			<main
				className={`flex flex-grow overflow-hidden ${isSubdirectory ? "" : "w-full"}`}
			>
				{children}
			</main>
		</div>
	);
}
