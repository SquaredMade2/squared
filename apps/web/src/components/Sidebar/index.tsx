"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import {
	useAuthStore,
	useTeamStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { useRouter } from "next/navigation";
import * as React from "react";
import { NewIssueButton } from "../Modals";
import { IconLeftMenu } from "./IconLeftMenu";
import { TeamAccordion } from "./TeamAccordion";
import { UserProfile } from "./UserProfile";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

export function SidebarNav() {
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { teams, getAllTeams, currentTeam } = useTeamStore((state) => state);
	const { showNavbar } = useViewStore((state) => state);
	const { user, logout } = useAuthStore((state) => state);
	const router = useRouter();
	const { toast } = useToast();

	React.useEffect(() => {
		if (!user) return;
		getAllTeams(user.id);
	}, [user, getAllTeams]);

	const handleLogout = async (): Promise<void> => {
		try {
			await logout();
			router.replace("/login");
			toast({ title: "Logged out successfully." });
		} catch (error) {
			console.error("Logout failed", error);
			toast({ title: "Failed to log out", variant: "destructive" });
		}
	};

	if (!workspace) return null;

	return (
		<SidebarProvider>
			<div
				className={`h-screen ${showNavbar ? "md:flex" : "md:hidden"} hidden`}
			>
				<IconLeftMenu />
				<Sidebar className="border-r">
					<SidebarHeader>
						<WorkspaceDropdown />
						<NewIssueButton />
					</SidebarHeader>
					<SidebarContent>
						<TeamAccordion teams={teams} currentTeam={currentTeam} />
					</SidebarContent>
					<UserProfile user={user} onLogout={handleLogout} />
				</Sidebar>
			</div>
			<SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
		</SidebarProvider>
	);
}
