"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useModalStore, useWorkspaceStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Home,
	Search,
	Settings,
	Inbox,
	Sun,
	Moon,
	LogOut,
	Menu,
} from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { VisuallyHidden } from "@repo/ui/visually-hidden";

const MobileMenuSheet = () => {
	const [mounted, setMounted] = useState(false);
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

	useEffect(() => {
		setMounted(true);
	}, []);

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
		workspace && !viewsRoute
			? router.push(`${baseUrl}/${workspace.url}`)
			: router.back();
	};

	if (!mounted) {
		return null;
	}

	const menuItems = [
		{ name: "Home", icon: Home, onClick: toHome },
		{ name: "Search", icon: Search, onClick: () => setShowCommand(true) },
		{
			name: "Settings",
			icon: Settings,
			onClick: () => navigateTo("settings/workspace"),
		},
		{ name: "Inbox", icon: Inbox, onClick: () => navigateTo("inbox") },
		{ name: "Logout", icon: LogOut, onClick: handleLogout },
	];

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-[300px] sm:w-[400px] flex flex-col h-full bg-card"
			>
				<SheetHeader className="ml-4">
					<Image src="/logo.png" alt="Logo" width={40} height={40} />
					<VisuallyHidden>
						<SheetTitle>Menu</SheetTitle>
					</VisuallyHidden>
				</SheetHeader>
				<div className="flex flex-col flex-grow justify-between">
					<div className="flex flex-col space-y-4 mt-4">
						{menuItems.map((item) => (
							<Button
								key={item.name}
								variant="ghost"
								className="w-full justify-start"
								onClick={item.onClick}
							>
								<item.icon className="mr-2 h-5 w-5" />
								{item.name}
							</Button>
						))}
					</div>
					<div className="mt-auto">
						<Separator className="mb-6" />
						<div className="flex justify-between">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setTheme("light")}
								className={theme === "light" ? "bg-accent" : ""}
							>
								<Sun className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setTheme("dark")}
								className={theme === "dark" ? "bg-accent" : ""}
							>
								<Moon className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileMenuSheet;
