"use client";
import React from "react";
import LogoutButton from "../LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGear,
	faInbox,
	faHouse,
	faMagnifyingGlass,
	faArrowRightFromBracket,
	faSun,
	faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useModalStore, useWorkspaceStore } from "@/store";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useToast } from "../ui/use-toast";

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
		<div className="flex flex-col h-screen items-center justify-between w-full py-2">
			<div className="flex flex-col items-center">
				<Button
					variant={"ghost"}
					className="text-muted-foreground hover:text-foreground"
					size="icon"
					onClick={toHome}
				>
					<FontAwesomeIcon icon={faHouse} />
				</Button>
				<Button
					variant={"ghost"}
					className="text-muted-foreground hover:text-foreground"
					size="icon"
					onClick={() => setShowCommand(true)}
				>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</Button>
				<Button
					variant={"ghost"}
					className="text-muted-foreground hover:text-foreground"
					size="icon"
					onClick={() => navigateTo("settings/workspace")}
				>
					<FontAwesomeIcon icon={faGear} />
				</Button>
				<Button
					variant={"ghost"}
					className="text-muted-foreground hover:text-foreground"
					size="icon"
					onClick={() => navigateTo("inbox")}
				>
					<FontAwesomeIcon icon={faInbox} />
				</Button>
				<Button
					variant={"ghost"}
					className="text-muted-foreground hover:text-foreground"
					size="icon"
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				>
					<FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} />
				</Button>
			</div>
			<Button
				variant={"ghost"}
				className="text-muted-foreground hover:text-foreground"
				size="icon"
				onClick={handleLogout}
			>
				<FontAwesomeIcon icon={faArrowRightFromBracket} />
			</Button>
		</div>
	);
};
export default IconLeftMenu;
