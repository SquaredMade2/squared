"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBars";
import { useEffect } from "react";
import { useViewStore } from "@/store";
import type { ViewPath } from "@/store/views";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
		if (pathname.endsWith("/all")) {
			setLastVisitedPage("all");
		} else if (pathname.endsWith("/active")) {
			setLastVisitedPage("active");
		} else if (pathname.endsWith("/backlog")) {
			setLastVisitedPage("backlog");
		} else if (pathname.endsWith("/sprints/current")) {
			setLastVisitedPage("sprints/current");
		} else if (isValidViewPath(pathname)) {
			setLastVisitedPage(getViewPath(pathname));
		}
	}, [pathname]);

	return (
		<div className="flex w-full overflow-hidden relative">
			{isSubdirectory && <Navbar />}
			<main
				className={`flex flex-grow overflow-hidden ${isSubdirectory ? "" : "w-full"}`}
			>
				{children}
			</main>
		</div>
	);
}
