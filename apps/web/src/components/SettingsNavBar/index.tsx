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
	ArrowLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTeamStore, useViewStore } from "@/store";
import type { Team } from "@repo/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

const SidebarContent = ({
	navigateTo,
	handleTeamClick,
	setTheme,
	theme,
	teams,
}: {
	navigateTo: (targetRoute: string) => void;
	handleTeamClick: (team: Team, path?: string) => void;
	setTheme: (theme: string) => void;
	theme: string;
	teams: Team[];
}) => {
	const router = useRouter();

	return (
		<div className="flex flex-col h-full">
			<ScrollArea className="flex-grow">
				<div className="p-6 space-y-6">
					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="icon" onClick={() => router.back()}>
							<ArrowLeft className="size-4" />
						</Button>
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
							<Accordion type="single" collapsible>
								{teams?.map((team) => (
									<AccordionItem key={team.id} value={team.id}>
										<AccordionTrigger className="h-10">
											{team.name}
										</AccordionTrigger>
										<AccordionContent>
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => handleTeamClick(team)}
											>
												Overview
											</Button>
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => handleTeamClick(team, "sprints")}
											>
												Sprints
											</Button>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
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

const SettingsNavBar = (): React.ReactElement => {
	const router = useRouter();
	const { setTheme, resolvedTheme: theme } = useTheme();
	const { setCurrentTeam, teams } = useTeamStore((state) => state);
	const { showMobileNavbar, setShowMobileNavbar } = useViewStore(
		(state) => state,
	);

	const navigateTo = (targetRoute: string) => {
		router.replace(`/settings/${targetRoute}`);
	};

	const handleTeamClick = (team: Team, path?: string) => {
		setCurrentTeam(team);
		navigateTo(`teams/${team.identifier}/${path ?? "overview"}`);
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="bg-card w-64 h-screen md:flex flex-col fixed left-0 hidden">
				<SidebarContent
					navigateTo={navigateTo}
					handleTeamClick={handleTeamClick}
					setTheme={setTheme}
					theme={theme ?? "dark"}
					teams={teams}
				/>
			</div>

			{/* Mobile Sheet */}
			<Sheet open={showMobileNavbar} onOpenChange={setShowMobileNavbar}>
				<SheetContent side="left" className="p-0 w-64 bg-card">
					<SidebarContent
						navigateTo={navigateTo}
						handleTeamClick={handleTeamClick}
						setTheme={setTheme}
						theme={theme ?? "dark"}
						teams={teams}
					/>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default SettingsNavBar;
