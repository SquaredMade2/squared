// app/team/[identifier]/[all]/layout.tsx
"use client";
import { useState } from "react";
import SettingsNavBar from "@/components/SettingsNavBar";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { cn } from "@/utils/cn";
export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [showNavbar, setShowNavbar] = useState(false);
	const toggleNavbar = () => {
		setShowNavbar(!showNavbar);
	};
	return (
		<div className="h-full w-full relative">
			{showNavbar && (
				<div
					className="w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 md:hidden"
					onClick={toggleNavbar}
				/>
			)}

			<div className="overflow-hidden relative">
				<div className="w-full h-12 md:hidden sticky top-0">
					<SettingsTopNavBar setShowNavBar={toggleNavbar} />
				</div>
				<div className="flex">
					<div
						className={cn(
							"w-64 absolute z-10 md:static transition-all duration-300 ease-in-out",
							showNavbar ? "left-0 top-0" : "-left-[100%]",
						)}
					>
						<SettingsNavBar toggleNavbar={toggleNavbar} />
					</div>
					<main>{children}</main>
				</div>
			</div>
		</div>
	);
}
