"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
	useAuthStore,
	useModalStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
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
	ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { VisuallyHidden } from "@repo/ui/visually-hidden";

const MobileMenuSheet = () => {
	const [mounted, setMounted] = useState(false);
	const { showMobileNavbar: open, setShowMobileNavbar: setOpen } = useViewStore(
		(state) => state,
	);
	const router = useRouter();
	const currentRoute = usePathname();
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { setShowCommand } = useModalStore((state) => state);
	const { resolvedTheme: theme, setTheme } = useTheme();
	const baseUrl = process.env.NEXT_PUBLIC_URL;
	const viewsRoute = currentRoute.includes("/views");
	const { toast } = useToast();
	const logout = useAuthStore((state) => state.logout);
	const { user } = useAuthStore((state) => state);

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
		{
			name: "Search",
			icon: Search,
			onClick: () => {
				setOpen(false);
				setShowCommand(true);
			},
		},
		{
			name: "Settings",
			icon: Settings,
			onClick: () => navigateTo("settings/workspace"),
		},
		{ name: "Inbox", icon: Inbox, onClick: () => navigateTo("inbox") },
	];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				side="left"
				className="w-[300px] sm:w-[400px] flex flex-col h-full bg-background"
			>
				<SheetHeader className="p-4 border-b">
					<div className="flex items-center space-x-3">
						<Image
							src="/logo.png"
							alt="Logo"
							width={40}
							height={40}
							className="rounded-md"
						/>
						<div className="flex flex-col items-start">
							<h2 className="text-lg font-semibold">Squared</h2>
							<p className="text-sm text-muted-foreground">Welcome back!</p>
						</div>
					</div>
					<VisuallyHidden>
						<SheetTitle>Menu</SheetTitle>
					</VisuallyHidden>
				</SheetHeader>
				<div className="flex flex-col flex-grow justify-between py-6">
					<nav className="space-y-2 px-4">
						{menuItems.map((item) => (
							<Button
								key={item.name}
								variant="ghost"
								className="w-full justify-between text-base font-normal hover:bg-accent"
								onClick={item.onClick}
							>
								<div className="flex items-center">
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</Button>
						))}
					</nav>
					<div className="space-y-4">
						<Separator />
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarImage src={user?.avatarUrl ?? ""} />
									<AvatarFallback>
										{user?.name?.charAt(0) || "U"}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium">{user?.name || "User"}</p>
									<p className="text-xs text-muted-foreground truncate w-5/6">
										{user?.email || "user@example.com"}
									</p>
								</div>
							</div>
							<Button variant="ghost" size="icon" onClick={handleLogout}>
								<LogOut className="h-5 w-5" />
							</Button>
						</div>
						<Separator />
						<div className="flex justify-between items-center">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setTheme("light")}
								className={theme === "light" ? "bg-card" : ""}
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

export const MobileMenuSheetTrigger = () => {
	const { setShowMobileNavbar: setOpen } = useViewStore((state) => state);

	return (
		<Button
			variant="ghost"
			size="icon"
			className="md:hidden"
			onClick={() => setOpen(true)}
		>
			<Menu className="h-5 w-5" />
			<span className="sr-only">Toggle menu</span>
		</Button>
	);
};

export default MobileMenuSheet;
