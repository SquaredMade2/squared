"use client";
import { LabelModal } from "@/components/Modals";
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
				<SidebarInset className="container flex-grow overflow-auto">
					<ScrollArea className="flex h-screen w-full justify-center overflow-y-hidden p-6">
						{children}
						<LabelModal />
					</ScrollArea>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
