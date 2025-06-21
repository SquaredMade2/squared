"use client";

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
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
	const { state: sidebarState } = useSidebar();
	const { signOut } = useClerk();
	const { organization } = useOrganization();

	const { data: notifications = [] } = useQuery({
		queryFn: async () => {
			const n = await client.event.getNotifications
				.$get()
				.then((res) => res.json());
			return n;
		},
		queryKey: ["notification", user?.id],
	});

	const { data: teams = [] } = useQuery({
		enabled: !!organization,
		queryFn: async () => {
			if (!organization) return [];
			const t = await client.team.getUserTeams.$get().then((res) => res.json());
			setTeams(t);
			return t;
		},
		queryKey: ["team", user?.id, organization?.id],
	});

	const handleLogout = async (): Promise<void> => {
		try {
			await signOut();
			router.replace("/sign-in");
			toast.success("Logged out successfully.");
		} catch (error) {
			toast.error("Failed to log out");
		}
	};

	const navigateTo = (childRoute: string): void => {
		router.push(`/${childRoute}`);
	};

	return (
		<Sidebar
			className="group/sidebar w-64 transition-all duration-300 ease-in-out data-[state=closed]:w-16"
			collapsible="icon"
		>
			<SidebarHeader
				className={`space-y-2 ${sidebarState === "expanded" ? "px-2" : "px-0"}`}
			>
				<div className="flex items-center justify-between gap-2">
					<WorkspaceDropdown />
					{sidebarState === "expanded" && (
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<Button
									aria-label="search"
									onClick={() => setShowCommand(true)}
									size="icon"
									variant="ghost"
								>
									<Search aria-hidden="true" className="h-4 w-4 shrink-0" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">Search</TooltipContent>
						</Tooltip>
					)}
				</div>
				<NewTaskButton />
				<div className="flex flex-col space-y-2">
					{sidebarState === "collapsed" && (
						<IconButton
							icon={Search}
							label="Search"
							onClick={() => setShowCommand(true)}
						/>
					)}
					<IconButton
						icon={Inbox}
						label="Inbox"
						notificationCount={notifications.length}
						onClick={() => navigateTo("inbox")}
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
			{sidebarState === "expanded" && organization?.slug && (
				<SidebarContainer className="px-2">
					<TeamAccordion
						currentTeam={team}
						teams={teams}
						workspaceUrl={organization.slug}
					/>
				</SidebarContainer>
			)}
			<SidebarFooter
				className={`mt-auto space-y-2 ${sidebarState === "expanded" ? "px-2" : "px-0"}`}
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
				aria-label={label}
				className="relative w-full justify-between px-3"
				onClick={onClick}
				size={state === "expanded" ? "sm" : "icon"}
				variant="ghost"
			>
				<div className="flex items-center">
					<Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
					<span className="ml-2 w-auto opacity-100 transition-all duration-300">
						{label}
					</span>
				</div>
				{!!(notificationCount && notificationCount > 0) && (
					<div
						aria-hidden="true"
						className=" h-2 w-2 rounded-full bg-primary"
					/>
				)}
			</Button>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild={true}>
				<Button
					aria-label={label}
					className="relative mx-1 justify-start px-3"
					onClick={onClick}
					size="icon"
					variant="ghost"
				>
					<Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
					<span className="ml-2 w-0 overflow-hidden opacity-0 transition-all duration-300">
						{label}
					</span>
					{!!(notificationCount && notificationCount > 0) && (
						<div
							aria-hidden="true"
							className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-primary"
						/>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right">{label}</TooltipContent>
		</Tooltip>
	);
}
