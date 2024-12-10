"use client";
import SettingsNavBar from "@/components/Settings/SettingsNavBar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
					<ScrollArea className="p-6 w-full flex justify-center overflow-y-hidden h-screen">
						{children}
					</ScrollArea>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
