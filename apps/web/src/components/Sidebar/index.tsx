"use client";

import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent as SidebarContainer,
	SidebarFooter,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { logout } from "@/lib/auth";
import { eventService, teamService } from "@/lib/services";
import {
	useModalStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { TODO } from "@squared/context";
import type { Workspace } from "@squared/db";
import {
	ClipboardList,
	Home,
	Inbox,
	type LucideIcon,
	Moon,
	Search,
	Settings,
	Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { NewTaskButton } from "../Modals";
import { TeamAccordion } from "./TeamAccordion";
import { UserProfile } from "./UserProfile";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

function SidebarContent({ workspace }: { workspace: Workspace | null }) {
	const { teams, setTeams, team } = useTeamStore((state) => state);
	const user = useUserStore((state) => state.user);
	const { setShowCommand } = useModalStore((state) => state);
	const router = useRouter();
	const { toast } = useToast();
	const { resolvedTheme: theme, setTheme } = useTheme();
	const [notifications, setNotifications] = React.useState(0);
	const { state } = useSidebar();

	React.useEffect(() => {
		if (!user || !workspace) return;

		const setAllTeams = async () => {
			setTeams(
				await teamService.getUserTeams(TODO, {
					userId: user.id,
					workspaceId: workspace.id,
				}),
			);
		};

		const fetchNotifications = async () => {
			const notifications = await eventService.getNotifications(TODO, {
				userId: user.id,
			});
			setNotifications(notifications?.filter((n) => !n.read).length || 0);
		};

		const fetchData = async () => {
			await Promise.all([setAllTeams(), fetchNotifications()]);
		};

		fetchData();
	}, [user, setTeams, workspace]);

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

	const navigateTo = (childRoute: string): void => {
		router.push(`/${childRoute}`);
	};

	const toHome = () => {
		router.push(`/${workspace?.url}/team/${team?.identifier}/all`);
	};

	return (
		<>
			<SidebarHeader className="space-y-2 px-2">
				<WorkspaceDropdown />
				<NewTaskButton />
				<div className="flex flex-col space-y-2">
					<IconButton icon={Home} label="Home" onClick={toHome} />
					<IconButton
						icon={Search}
						label="Search"
						onClick={() => setShowCommand(true)}
					/>
					<IconButton
						icon={Settings}
						label="Settings"
						onClick={() => navigateTo(`settings/${workspace?.url}`)}
					/>
					<IconButton
						icon={Inbox}
						label="Inbox"
						onClick={() => navigateTo("inbox")}
						notificationCount={notifications}
					/>
					<IconButton
						icon={ClipboardList}
						label="My Tasks"
						onClick={() => navigateTo(`${workspace?.url}/my-tasks/assigned`)}
					/>
				</div>
			</SidebarHeader>
			{state === "expanded" && (
				<SidebarContainer className="px-2">
					<TeamAccordion teams={teams} currentTeam={team} />
				</SidebarContainer>
			)}
			<SidebarFooter className="space-y-2 px-2 mt-auto">
				<IconButton
					icon={theme === "dark" ? Moon : Sun}
					label={
						theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
					}
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				/>
				<UserProfile user={user} onLogout={handleLogout} />
			</SidebarFooter>
		</>
	);
}

export function SidebarNav() {
	const { workspace } = useWorkspaceStore((state) => state);

	return (
		<TooltipProvider delayDuration={0}>
			<SidebarProvider className="relative">
				<Sidebar
					collapsible="icon"
					className="w-64 group/sidebar transition-all duration-300 ease-in-out data-[state=closed]:w-16"
				>
					<SidebarContent workspace={workspace} />
				</Sidebar>
				<ToggleSidebarButton />
			</SidebarProvider>
		</TooltipProvider>
	);
}

function ToggleSidebarButton() {
	const { state } = useSidebar();

	return (
		<SidebarTrigger
			className={`absolute top-4 z-50 transition-all duration-300 ease-in-out ${
				state === "collapsed" ? "left-16" : "md:left-[17rem]"
			}`}
		/>
	);
}

interface IconButtonProps {
	icon: LucideIcon;
	label: string;
	onClick: () => void;
	notificationCount?: number;
}

export function IconButton({
	icon: Icon,
	label,
	onClick,
	notificationCount,
}: IconButtonProps) {
	const { state } = useSidebar();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					aria-label={label}
					onClick={onClick}
					className={`relative w-full justify-start ${
						state === "collapsed" ? "px-2" : ""
					}`}
				>
					<Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
					<span
						className={`ml-2 transition-all duration-300 ${
							state === "collapsed"
								? "w-0 opacity-0 overflow-hidden"
								: "w-auto opacity-100"
						}`}
					>
						{label}
					</span>
					{!!(notificationCount && notificationCount > 0) && (
						<div
							className={`absolute h-2 w-2 bg-primary rounded-full ${
								state === "collapsed" ? "top-0.5 right-0.5" : "top-3 right-3"
							}`}
							aria-hidden="true"
						/>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right">{label}</TooltipContent>
		</Tooltip>
	);
}
