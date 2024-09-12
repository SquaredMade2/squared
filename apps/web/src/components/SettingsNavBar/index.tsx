"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import {
	BriefcaseBusiness,
	CircleUser,
	Plus,
	Users,
	Sun,
	Moon,
} from "lucide-react";
import type { SettingsNavbarProps } from "./SettingsNavBarProps";
import { useTheme } from "next-themes";
import BackButton from "../BackButton";
import { useTeamStore, useWorkspaceStore } from "@/storeZ";
import type { Team } from "@repo/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const SettingsNavBar = ({
	setLoading,
	toggleNavbar,
}: SettingsNavbarProps): React.ReactElement => {
	const router = useRouter();
	const { setTheme, theme } = useTheme();
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { teams, setCurrentTeam } = useTeamStore((state) => state);

	const navigateTo = (targetRoute: string) => {
		router.replace(`/settings/${targetRoute}`);
		toggleNavbar?.();
	};

	const handleTeamClick = (team: Team) => {
		if (setLoading) {
			setLoading(true);
		}
		setCurrentTeam(team);
		navigateTo(`teams/${team.identifier}`);
	};

	return (
		<div className="bg-card w-64 h-screen md:flex flex-col fixed left-0 hidden">
			<ScrollArea className="flex-grow">
				<div className="p-6 space-y-6">
					<div className="flex items-center space-x-2">
						<BackButton hoverbackground="bg-accent" />
						<h1 className="text-2xl font-semibold">Settings</h1>
					</div>

					<div className="space-y-4">
						<div>
							<h2 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
								<BriefcaseBusiness className="mr-2 h-4 w-4" />
								Workspace
							</h2>
							<div className="space-y-1 ml-6">
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={() => navigateTo("workspace")}
								>
									General
								</Button>
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={() => navigateTo("members")}
								>
									Members
								</Button>
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={() => navigateTo("integrations")}
								>
									Integrations
								</Button>
							</div>
						</div>

						<Separator />

						<div>
							<h2 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
								<CircleUser className="mr-2 h-4 w-4" />
								My Account
							</h2>
							<div className="space-y-1 ml-6">
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={() => navigateTo("profile")}
								>
									Profile
								</Button>
							</div>
						</div>

						<Separator />

						<div>
							<h2 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
								<Users className="mr-2 h-4 w-4" />
								Teams
							</h2>
							{currentWorkspace && (
								<ul className="space-y-1 ml-6">
									{teams?.map((team) => (
										<li key={team.id}>
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => handleTeamClick(team)}
											>
												{team.name}
											</Button>
										</li>
									))}
								</ul>
							)}
							<Button
								variant="ghost"
								className="w-full justify-start mt-2"
								onClick={() => navigateTo("new-team")}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add team
							</Button>
						</div>
					</div>
				</div>
			</ScrollArea>

			<div className="p-6">
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
	);
};

export default SettingsNavBar;
