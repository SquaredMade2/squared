"use client";

import {
	Sidebar,
	SidebarContent as SidebarContainer,
	SidebarFooter,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { client } from "@/lib/client";
import { useModalStore, useTeamStore } from "@/store";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import {
	Clipboard,
	Inbox,
	Moon,
	Search,
	type SquaredIcon,
	Sun,
} from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { toast } from "@squaredmade/ui/toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NewTaskButton } from "../Modals";
import { TeamAccordion } from "./TeamAccordion";
import { UserProfile } from "./UserProfile";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

function SidebarContent() {
	const { setTeams, team } = useTeamStore((state) => state);
	const { user } = useUser();
	const { setShowCommand } = useModalStore((state) => state);
	const router = useRouter();
	const { resolvedTheme: theme, setTheme } = useTheme();
	const { state } = useSidebar();
	const { signOut } = useClerk();
	const { organization } = useOrganization();

	const { data: notifications = [] } = useQuery({
		queryKey: ["notification", user?.id],
		queryFn: async () => {
			const notifications = await client.event.getNotifications
				.$get()
				.then((res) => res.json());
			return notifications;
		},
	});

	const { data: teams = [] } = useQuery({
		queryKey: ["team", user?.id, organization?.id],
		queryFn: async () => {
			if (!organization) return [];
			const teams = await client.team.getUserTeams
				.$get()
				.then((res) => res.json());
			setTeams(teams);
			return teams;
		},
		enabled: !!organization,
	});

	const handleLogout = async (): Promise<void> => {
		try {
			await signOut();
			router.replace("/sign-in");
			toast.success("Logged out successfully.");
		} catch (error) {
			console.error("Logout failed", error);
			toast.error("Failed to log out");
		}
	};

	const navigateTo = (childRoute: string): void => {
		router.push(`/${childRoute}`);
	};

	return (
		<Sidebar
			collapsible="icon"
			className="group/sidebar w-64 transition-all duration-300 ease-in-out data-[state=closed]:w-16"
		>
			<SidebarHeader
				className={`space-y-2 ${state === "expanded" ? "px-2" : "px-0"}`}
			>
				<div className="flex items-center justify-between gap-2">
					<WorkspaceDropdown />
					{state === "expanded" && (
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<Button
									variant="ghost"
									size="icon"
									aria-label="search"
									onClick={() => setShowCommand(true)}
								>
									<Search className="h-4 w-4 shrink-0" aria-hidden="true" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">Search</TooltipContent>
						</Tooltip>
					)}
				</div>
				<NewTaskButton />
				<div className="flex flex-col space-y-2">
					{state === "collapsed" && (
						<IconButton
							icon={Search}
							label="Search"
							onClick={() => setShowCommand(true)}
						/>
					)}
					<IconButton
						icon={Inbox}
						label="Inbox"
						onClick={() => navigateTo("inbox")}
						notificationCount={notifications.length}
					/>
					<IconButton
						icon={Clipboard}
						label="My Tasks"
						onClick={() =>
							navigateTo(`${organization?.slug}/my-tasks/assigned`)
						}
					/>
				</div>
			</SidebarHeader>
			{state === "expanded" && organization?.slug && (
				<SidebarContainer className="px-2">
					<TeamAccordion
						teams={teams}
						currentTeam={team}
						workspaceUrl={organization.slug}
					/>
				</SidebarContainer>
			)}
			<SidebarFooter
				className={`mt-auto space-y-2 ${state === "expanded" ? "px-2" : "px-0"}`}
			>
				<IconButton
					icon={theme === "dark" ? Moon : Sun}
					label={
						theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
					}
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				/>
				<UserProfile onLogout={handleLogout} />
			</SidebarFooter>
		</Sidebar>
	);
}

export function SidebarNav() {
	return (
		<TooltipProvider delayDuration={0}>
			<SidebarProvider className="relative">
				<SidebarContent />
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
	icon: SquaredIcon;
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
	const { state } = useSidebar();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	if (state === "expanded") {
		return (
			<Button
				variant="ghost"
				size={state === "expanded" ? "sm" : "icon"}
				aria-label={label}
				onClick={onClick}
				className="relative w-full justify-between px-3"
			>
				<div className="flex items-center">
					<Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
					<span className="ml-2 w-auto opacity-100 transition-all duration-300">
						{label}
					</span>
				</div>
				{!!(notificationCount && notificationCount > 0) && (
					<div
						className=" h-2 w-2 rounded-full bg-primary"
						aria-hidden="true"
					/>
				)}
			</Button>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild={true}>
				<Button
					variant="ghost"
					size="icon"
					aria-label={label}
					onClick={onClick}
					className="relative mx-1 justify-start px-3"
				>
					<Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
					<span className="ml-2 w-0 overflow-hidden opacity-0 transition-all duration-300">
						{label}
					</span>
					{!!(notificationCount && notificationCount > 0) && (
						<div
							className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-primary"
							aria-hidden="true"
						/>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right">{label}</TooltipContent>
		</Tooltip>
	);
}
