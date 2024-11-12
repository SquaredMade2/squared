"use client";
import SettingsNavBar from "@/components/SettingsNavBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function SettingsLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex h-screen">
				<SettingsNavBar />
				<SidebarInset className="flex-grow overflow-auto">
					<main className="p-6">{children}</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
