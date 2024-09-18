"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useModalStore, useWorkspaceStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config, type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
	faHouse,
	faMagnifyingGlass,
	faGear,
	faInbox,
	faSun,
	faMoon,
	faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// Prevent FontAwesome from adding its CSS since we did it manually above
config.autoAddCss = false;

const IconLeftMenu = () => {
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
		homeRoute && !viewsRoute ? "" : router.back();
	};

	if (!mounted) {
		return null; // Prevent rendering until client-side
	}

	return (
		<div className="flex fixed flex-col h-screen items-center justify-between w-14 bg-muted dark:bg-accent py-2">
			<div className="flex flex-col items-center space-y-4">
				<IconButton onClick={toHome} icon={faHouse} />
				<IconButton
					onClick={() => setShowCommand(true)}
					icon={faMagnifyingGlass}
				/>
				<IconButton
					onClick={() => navigateTo("settings/workspace")}
					icon={faGear}
				/>
				<IconButton onClick={() => navigateTo("inbox")} icon={faInbox} />
				<IconButton
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					icon={theme === "dark" ? faMoon : faSun}
				/>
			</div>
			<IconButton onClick={handleLogout} icon={faArrowRightFromBracket} />
		</div>
	);
};

const IconButton = ({
	onClick,
	icon,
}: { onClick: () => void; icon: IconDefinition }) => (
	<Button
		variant="ghost"
		className="text-muted-foreground hover:text-foreground w-10 h-10 p-0"
		onClick={onClick}
	>
		<FontAwesomeIcon icon={icon} className="h-5 w-5" />
	</Button>
);

export default IconLeftMenu;
