"use client";

import {
	BriefcaseBusiness,
	ChevronLeft,
	CircleUser,
	Moon,
	Sun,
	Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import AddTeamButton from "@/components/Buttons/AddTeamButton";
import { WorkspaceDropdown } from "@/components/Sidebar/WorkspaceDropdown";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTeamStore, useWorkspaceStore } from "@/store";
import type { Team } from "@squared/db";

function SettingsNavbarContent() {
	const router = useRouter();
	const { setTheme, resolvedTheme: theme } = useTheme();
	const { setTeam, teams } = useTeamStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const navigateTo = (targetRoute: string) => {
		router.replace(`/${workspace?.url}/settings/${targetRoute}`);
	};
	const handleTeamClick = (team: Team, path?: string) => {
		setTeam(team);
		navigateTo(`teams/${team.identifier}/${path ?? "overview"}`);
	};

	return (
		<>
			<SidebarHeader className="border-b p-4">
				<WorkspaceDropdown />
				<Button
					variant="ghost"
					onClick={() =>
						teams[0] &&
						router.push(`/${workspace?.url}/team/${teams[0].identifier}/all`)
					}
					size="sm"
					className="py-px gap-2 text-muted-foreground text-sm"
				>
					<ChevronLeft />
					Back to Dashboard
				</Button>
			</SidebarHeader>
			<SidebarContent>
				<ScrollArea className="h-[calc(100vh-8rem)]">
					<div className="space-y-4 p-4">
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
										onClick={() => navigateTo("")}
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
									<Button
										variant="ghost"
										className="w-full justify-start"
										onClick={() => navigateTo("connections")}
									>
										Connections
									</Button>
								</div>
							</div>

							<Separator />

							<div>
								<h2 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
									<Users className="mr-2 h-4 w-4" />
									Teams
								</h2>
								<Accordion type="single" collapsible className="ml-6">
									{teams?.map((team) => (
										<AccordionItem key={team.id} value={team.id}>
											<AccordionTrigger className="py-2">
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
													onClick={() => handleTeamClick(team, "members")}
												>
													Members
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
								<div className="ml-6">
									<AddTeamButton workspaceUrl={workspace?.url ?? ""} />
								</div>
							</div>
						</div>
					</div>
				</ScrollArea>
			</SidebarContent>
			<SidebarFooter className="border-t p-4">
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
			</SidebarFooter>
		</>
	);
}

function ToggleSidebarButton() {
	const { state } = useSidebar();

	return (
		<SidebarTrigger
			className={`absolute top-4 z-50 transition-all duration-300 ease-in-out ${
				state === "collapsed" ? "left-4" : "md:left-[17rem]"
			}`}
		/>
	);
}

export default function SettingsNavBar() {
	return (
		<TooltipProvider delayDuration={0}>
			<Sidebar
				collapsible="offcanvas"
				className="w-64 group/sidebar transition-all duration-300 ease-in-out data-[state=closed]:w-16"
			>
				<SettingsNavbarContent />
			</Sidebar>
			<ToggleSidebarButton />
		</TooltipProvider>
	);
}
