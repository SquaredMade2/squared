"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventService } from "@/lib/services";
import {
	useAuthStore,
	useModalStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { TODO } from "@squared/context";
import { Home, Inbox, Moon, Search, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

export function IconLeftMenu() {
	const router = useRouter();
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { setShowCommand } = useModalStore((state) => state);
	const [notifications, setNotifications] = React.useState(0);
	const { resolvedTheme: theme, setTheme } = useTheme();
	const { user } = useAuthStore((state) => state);

	React.useEffect(() => {
		const fetchNotifications = async () => {
			const notifications =
				user &&
				(await eventService.getNotifications(TODO, { userId: user.id }));
			setNotifications(notifications?.filter((n) => !n.read).length || 0);
		};
		fetchNotifications();
	}, [user]);

	const navigateTo = (childRoute: string): void => {
		router.push(`/${childRoute}`);
	};

	const toHome = () => {
		router.push(`/${workspace?.url}/team/${currentTeam?.identifier}/all`);
	};

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex flex-col h-full justify-between items-center w-12 py-2 bg-secondary">
				<div className="flex flex-col items-center space-y-4">
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
				<IconButton
					icon={theme === "dark" ? Moon : Sun}
					label={
						theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
					}
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				/>
			</div>
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
					size="icon"
					aria-label={label}
					onClick={onClick}
					className="relative"
				>
					<Icon className="h-4 w-4" />
					{notificationCount && notificationCount > 0 && (
						<div className="absolute bottom-0.5 right-0.5 h-2 w-2 bg-primary rounded-full" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right">{label}</TooltipContent>
		</Tooltip>
	);
}
