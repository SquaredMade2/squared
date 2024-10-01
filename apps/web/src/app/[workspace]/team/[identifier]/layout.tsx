"use client";
import Navbar from "@/components/NavBars";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex w-full overflow-hidden relative">
			<Navbar />
			<main className="flex flex-grow overflow-hidden">{children}</main>
		</div>
	);
}
