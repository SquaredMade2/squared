// app/team/[identifier]/[all]/layout.tsx
"use client";
import { useState } from "react";
import SettingsNavBar from "@/components/SettingsNavBar";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
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
		<div className="h-full w-full relative flex">
			<SettingsTopNavBar />
			<SettingsNavBar toggleNavbar={toggleNavbar} />
			<main className="md:ml-64 mt-12">{children}</main>
		</div>
	);
}
