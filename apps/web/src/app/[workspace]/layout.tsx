"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBars";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	// Check if we're in a subdirectory
	const isSubdirectory = pathname.split("/").filter(Boolean).length > 3;

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
