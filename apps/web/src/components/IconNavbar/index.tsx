"use client";

import { useRouter } from "next/navigation";
import {
	useAuthStore,
	useModalStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, Inbox, Moon, Search, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { eventService } from "@/lib/services";
import { TODO } from "@squared/context";

const IconLeftMenu = () => {
	const router = useRouter();
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { setShowCommand } = useModalStore((state) => state);
	const [notifications, setNotifications] = useState(0);
	const { resolvedTheme: theme, setTheme } = useTheme();
	const { user } = useAuthStore((state) => state);
	const [mounted, setMounted] = useState(false);

	const navigateTo = (childRoute: string): void => {
		router.push(`/${childRoute}`);
	};

	const toHome = () => {
		router.push(`/${workspace?.url}/team/${currentTeam?.identifier}/all`);
	};

	useEffect(() => {
		setMounted(true);
		const fetchNotifications = async () => {
			const notifications =
				user &&
				(await eventService.getNotifications(TODO, { userId: user.id }));
			setNotifications(notifications?.filter((n) => !n.read).length || 0);
		};
		fetchNotifications();
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex flex-col h-screen items-center justify-between w-12 py-2 bg-secondary">
				<div className="flex flex-col items-center space-y-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Go home"
								onClick={toHome}
							>
								<Home className="size-4" />
								<span className="sr-only">Home</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right" className="mb-8">
							Home
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Search"
								onClick={() => setShowCommand(true)}
							>
								<Search className="size-4" />
								<span className="sr-only">Search</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right" className="mb-8">
							Search
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Go to settings"
								onClick={() => navigateTo("settings/workspace")}
							>
								<Settings className="size-4" />
								<span className="sr-only">Settings</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right" className="mb-8">
							Settings
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Go to inbox"
								onClick={() => navigateTo("inbox")}
								className="relative"
							>
								<Inbox className="size-4" />
								<span className="sr-only">Inbox</span>
								{notifications > 0 && (
									<div className="absolute bottom-2.5 right-2.5 size-2 bg-primary rounded-full" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right" className="mb-8">
							Inbox
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Toggle theme"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							>
								{theme === "dark" ? (
									<Moon className="size-4" />
								) : (
									<Sun className="size-4" />
								)}
								<span className="sr-only">Toggle theme</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right" className="mb-8">
							{theme === "dark"
								? "Switch to Light Mode"
								: "Switch to Dark Mode"}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default IconLeftMenu;
