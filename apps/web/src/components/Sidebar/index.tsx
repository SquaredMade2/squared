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
import { eventService } from "@/lib/services";
import {
	useAuthStore,
	useModalStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { TODO } from "@squared/context";
import {
	ChevronLeft,
	Home,
	Inbox,
	Moon,
	Search,
	Settings,
	Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { NewIssueButton } from "../Modals";
import { TeamAccordion } from "./TeamAccordion";
import { UserProfile } from "./UserProfile";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

function SidebarContent() {
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { teams, getAllTeams, currentTeam } = useTeamStore((state) => state);
	const { user, logout } = useAuthStore((state) => state);
	const { setShowCommand } = useModalStore((state) => state);
	const router = useRouter();
	const { toast } = useToast();
	const { resolvedTheme: theme, setTheme } = useTheme();
	const [notifications, setNotifications] = React.useState(0);
	const { toggleSidebar } = useSidebar();

	React.useEffect(() => {
		if (!user) return;
		getAllTeams(user.id);
		fetchNotifications();
	}, [user, getAllTeams]);

	const fetchNotifications = async () => {
		if (!user) return;
		const notifications = await eventService.getNotifications(TODO, {
			userId: user.id,
		});
		setNotifications(notifications?.filter((n) => !n.read).length || 0);
	};

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
		router.push(`/${workspace?.url}/team/${currentTeam?.identifier}/all`);
	};

	return (
		<>
			<SidebarHeader className="space-y-2 px-2">
				<WorkspaceDropdown />
				<NewIssueButton />
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
						onClick={() => navigateTo("settings/workspace")}
					/>
					<IconButton
						icon={Inbox}
						label="Inbox"
						onClick={() => navigateTo("inbox")}
						notificationCount={notifications}
					/>
				</div>
			</SidebarHeader>
			<SidebarContainer>
				<TeamAccordion teams={teams} currentTeam={currentTeam} />
			</SidebarContainer>
			<SidebarFooter className="space-y-2 px-2">
				<IconButton
					icon={theme === "dark" ? Moon : Sun}
					label={
						theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
					}
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				/>
				<UserProfile user={user} onLogout={handleLogout} />
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
					className="w-full justify-start group-data-[state=closed]/sidebar:hidden"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="ml-2">Collapse sidebar</span>
				</Button>
			</SidebarFooter>
		</>
	);
}

export function SidebarNav() {
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);

	if (!workspace) return null;

	return (
		<TooltipProvider delayDuration={0}>
			<SidebarProvider>
				<Sidebar collapsible="icon" className="w-64 group/sidebar">
					<SidebarContent />
				</Sidebar>
				<SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
			</SidebarProvider>
		</TooltipProvider>
	);
}

interface IconButtonProps {
	icon: React.ElementType;
	label: string;
	onClick: () => void;
	notificationCount?: number;
}

function IconButton({
	icon: Icon,
	label,
	onClick,
	notificationCount,
}: IconButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					aria-label={label}
					onClick={onClick}
					className="relative w-full justify-start"
				>
					<Icon className="h-4 w-4 shrink-0" />
					<span className="ml-2 group-data-[state=closed]/sidebar:hidden">
						{label}
					</span>
					{notificationCount && notificationCount > 0 && (
						<div className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right">{label}</TooltipContent>
		</Tooltip>
	);
}
