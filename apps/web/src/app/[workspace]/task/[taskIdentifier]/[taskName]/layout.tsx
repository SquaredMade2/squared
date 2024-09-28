"use client";
import Navbar from "@/components/NavBars";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex w-full overflow-hidden relative">
			<div className="hidden lg:block">
				<Navbar />
			</div>
			<main className="flex flex-grow overflow-hidden">{children}</main>
		</div>
	);
}
