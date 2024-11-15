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
			<div className="flex h-screen w-full">
				<SettingsNavBar />
				<SidebarInset className="flex-grow overflow-auto container">
					<main className="p-6 w-full flex justify-center">{children}</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
