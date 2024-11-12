"use client";
import SettingsNavBar from "@/components/SettingsNavBar";

export default function SettingsLayoutWrapper({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full relative flex">
			<SettingsNavBar />
			<main className="md:ml-72 w-full mt-12">{children}</main>
		</div>
	);
}
