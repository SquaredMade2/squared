"use client";
import Navbar from "@/components/NavBar";
import { cn } from "@/utils/cn";
import { useViewStore } from "@/storeZ";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);

	const toggleNavbar = (): void => {
		setShowNavbar(!showNavbar);
	};

	return (
		<div className="flex w-full overflow-hidden relative">
			{showNavbar && (
				<div
					className="w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 md:hidden"
					onClick={toggleNavbar}
				/>
			)}
			<div
				className={cn(
					"absolute md:static transition-all duration-500 ease-in-out z-10 w-72 h-full",
					showNavbar ? "left-0 top-0" : "-left-[100%]",
				)}
			>
				<Navbar />
			</div>

			<main className="flex flex-grow overflow-hidden">{children}</main>
		</div>
	);
}
