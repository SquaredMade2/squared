"use client";

import { useOrganization } from "@clerk/nextjs";
import type { Team } from "@squaredmade/db";
import {
	BriefcaseBusiness,
	ChevronLeft,
	CircleUser,
	Moon,
	Sun,
	Users,
} from "@squaredmade/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@squaredmade/ui/accordion";
import { Button } from "@squaredmade/ui/button";
import { Separator } from "@squaredmade/ui/separator";
import { TooltipProvider } from "@squaredmade/ui/tooltip";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import AddTeamButton from "@/components/Buttons/AddTeamButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { useTeams } from "@/hooks/useTeams";
import { useTeamStore } from "@/store";

function SettingsNavbarContent() {
	const router = useRouter();
	const { setTheme, resolvedTheme: theme } = useTheme();
	const { teams } = useTeams();
	const { organization } = useOrganization();
	const { setTeam } = useTeamStore((state) => state);

	const navigateTo = (targetRoute: string) => {
		router.replace(`/${organization?.slug}/settings/${targetRoute}`);
	};
	const handleTeamClick = (team: Team, path?: string) => {
		setTeam(team);
		navigateTo(`teams/${team.identifier}/${path ?? "overview"}`);
	};

	return (
		<>
			<SidebarHeader className="border-b p-4">
				<Button
					className="gap-2 py-px text-muted-foreground text-sm"
					onClick={() =>
						teams[0] &&
						router.push(
							`/${organization?.slug}/team/${teams[0].identifier}/all`,
						)
					}
					size="sm"
					variant="ghost"
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
								<h2 className="mb-2 flex items-center font-medium text-muted-foreground text-sm">
									<BriefcaseBusiness className="mr-2 h-4 w-4" />
									Workspace
								</h2>
								<div className="ml-6 space-y-1">
									<Button
										className="w-full justify-start"
										onClick={() => navigateTo("")}
										variant="ghost"
									>
										General
									</Button>
									<Button
										className="w-full justify-start"
										onClick={() => navigateTo("members")}
										variant="ghost"
									>
										Members
									</Button>
									<Button
										className="w-full justify-start"
										onClick={() => navigateTo("integrations")}
										variant="ghost"
									>
										Integrations
									</Button>
									<Button
										className="w-full justify-start"
										onClick={() => navigateTo("labels")}
										variant="ghost"
									>
										Labels
									</Button>
								</div>
							</div>

							<Separator />

							<div>
								<h2 className="mb-2 flex items-center font-medium text-muted-foreground text-sm">
									<CircleUser className="mr-2 h-4 w-4" />
									My Account
								</h2>
								<div className="ml-6 space-y-1">
									<Button
										className="w-full justify-start"
										onClick={() => navigateTo("profile")}
										variant="ghost"
									>
										Profile
									</Button>
									<Button
										className="w-full justify-start"
										onClick={() => navigateTo("connections")}
										variant="ghost"
									>
										Connections
									</Button>
								</div>
							</div>

							<Separator />

							<div>
								<h2 className="mb-2 flex items-center font-medium text-muted-foreground text-sm">
									<Users className="mr-2 h-4 w-4" />
									Teams
								</h2>
								<Accordion className="ml-6" collapsible type="single">
									{teams?.map((team) => (
										<AccordionItem key={team.id} value={team.id}>
											<AccordionTrigger className="py-2">
												{team.name}
											</AccordionTrigger>
											<AccordionContent>
												<Button
													className="w-full justify-start"
													onClick={() => handleTeamClick(team)}
													variant="ghost"
												>
													Overview
												</Button>
												<Button
													className="w-full justify-start"
													onClick={() => handleTeamClick(team, "members")}
													variant="ghost"
												>
													Members
												</Button>
												<Button
													className="w-full justify-start"
													onClick={() => handleTeamClick(team, "sprints")}
													variant="ghost"
												>
													Sprints
												</Button>
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
								<div className="ml-6">
									<AddTeamButton workspaceUrl={organization?.slug ?? ""} />
								</div>
							</div>
						</div>
					</div>
				</ScrollArea>
			</SidebarContent>
			<SidebarFooter className="border-t p-4">
				<div className="flex justify-between">
					<Button
						className={theme === "light" ? "bg-accent" : ""}
						onClick={() => setTheme("light")}
						size="icon"
						variant="outline"
					>
						<Sun className="h-4 w-4" />
					</Button>
					<Button
						className={theme === "dark" ? "bg-accent" : ""}
						onClick={() => setTheme("dark")}
						size="icon"
						variant="outline"
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
				className="group/sidebar w-64 transition-all duration-300 ease-in-out data-[state=closed]:w-16"
				collapsible="offcanvas"
			>
				<SettingsNavbarContent />
			</Sidebar>
			<ToggleSidebarButton />
		</TooltipProvider>
	);
}
