// app/team/[identifier]/[all]/layout.tsx

import SettingsNavBar from "@/components/SettingsNavBar";
import React from "react";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex">
			<div className="w-64">
				<SettingsNavBar />
			</div>
			<main>{children}</main>
		</div>
	);
}
