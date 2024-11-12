"use client";

import {
	ArrowLeft,
	BriefcaseBusiness,
	CircleUser,
	Moon,
	Plus,
	Sun,
	Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

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
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTeamStore } from "@/store";
import type { Team } from "@squared/db";
import { WorkspaceDropdown } from "../Sidebar/WorkspaceDropdown";

export default function SettingsNavBar() {
	const router = useRouter();
	const { setTheme, resolvedTheme: theme } = useTheme();
	const { setTeam, teams } = useTeamStore((state) => state);

	const navigateTo = (targetRoute: string) => {
		router.replace(`/settings/${targetRoute}`);
	};

	const handleTeamClick = (team: Team, path?: string) => {
		setTeam(team);
		navigateTo(`teams/${team.identifier}/${path ?? "overview"}`);
	};

	return (
		<SidebarProvider>
			<Sidebar className="border-r" collapsible="icon">
				<SidebarHeader className="border-b p-4">
					<WorkspaceDropdown />
				</SidebarHeader>
				<SidebarContent>
					<ScrollArea className="h-[calc(100vh-8rem)]">
						<div className="space-y-4 p-4">
							<div className="flex items-center space-x-2">
								<Button
									asChild
									variant="ghost"
									size="icon"
									aria-label="Go back"
								>
									<SidebarTrigger>
										<ArrowLeft className="h-4 w-4" />
									</SidebarTrigger>
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
										className="w-full justify-start mt-2 ml-6"
										onClick={() => navigateTo("new-team")}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add team
									</Button>
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
			</Sidebar>
		</SidebarProvider>
	);
}
