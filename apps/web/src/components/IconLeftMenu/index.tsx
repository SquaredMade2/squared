"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useModalStore, useWorkspaceStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, Inbox, LogOut, Moon, Search, Settings, Sun } from "lucide-react";

const IconLeftMenu = () => {
	const router = useRouter();
	const currentRoute = usePathname();
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { setShowCommand } = useModalStore((state) => state);
	const { theme, setTheme } = useTheme();
	const baseUrl = process.env.NEXT_PUBLIC_URL;
	const homeRoute = currentRoute.includes(`${workspace?.url}`);
	const viewsRoute = currentRoute.includes("/views");
	const { toast } = useToast();
	const logout = useAuthStore((state) => state.logout);

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
		router.push(`${baseUrl}/${childRoute}`);
	};

	const toHome = () => {
		homeRoute && !viewsRoute ? "" : router.back();
	};

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex flex-col h-screen items-center justify-between w-12 py-2 bg-secondary">
				<div className="flex flex-col items-center space-y-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" onClick={toHome}>
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
								onClick={() => navigateTo("inbox")}
							>
								<Inbox className="size-4" />
								<span className="sr-only">Inbox</span>
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

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" onClick={handleLogout}>
							<LogOut className="size-4" />
							<span className="sr-only">Logout</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">Logout</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
};

export default IconLeftMenu;
