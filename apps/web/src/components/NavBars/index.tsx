"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import WorkSpaceDropDown from "@/components/WorkSpaceDropdown";
import { NewIssueModal, NewIssueButton } from "@/components/Modals";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { LayoutGrid, LogOut } from "lucide-react";
import IconLeftMenu from "../IconNavbar";
import {
	useAuthStore,
	useTeamStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { Team } from "@squared/db";
import NavBarTeams from "./NavBarTeams";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";

const Navbar = () => {
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { teams, getAllTeams, currentTeam } = useTeamStore((state) => state);
	const { showNavbar } = useViewStore((state) => state);
	const { user, logout } = useAuthStore((state) => state);
	const router = useRouter();
	const pathname = usePathname();
	const { toast } = useToast();

	useEffect(() => {
		if (!workspace) return;
		getAllTeams(workspace.id);
	}, [workspace, getAllTeams]);

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

	if (!workspace) return null;

	const getCurrentPage = (path: string) => {
		if (path.endsWith("/all")) return "all";
		if (path.endsWith("/active")) return "active";
		if (path.endsWith("/backlog")) return "backlog";
		if (path.includes("/views")) return "views";
		if (path.endsWith("/current")) return "current";
		if (path.includes("/sprints")) return "sprints";
		if (path.includes("/upcoming")) return "upcoming";
		return "";
	};

	const currentPage = getCurrentPage(pathname);

	return (
		<>
			<div className={`h-screen md:${showNavbar ? "flex" : "hidden"} hidden`}>
				<IconLeftMenu />

				<div className="h-full flex flex-col cursor-default text-foreground gap-5 py-2 bg-popover w-64">
					<div className="flex flex-col gap-5 px-2">
						<WorkSpaceDropDown />
						<NewIssueButton />
						<Button
							variant="ghost"
							size="sm"
							className="justify-start"
							onClick={() =>
								router.push(`/${workspace?.url}/my-tasks/assigned`)
							}
						>
							My Tasks
						</Button>
					</div>
					<ScrollArea className="px-2">
						{currentTeam && (
							<Accordion
								type="single"
								collapsible
								defaultValue={currentTeam.id}
							>
								{teams?.map((team: Team) => (
									<AccordionItem key={team.id} value={team.id}>
										<AccordionTrigger className="text-sm h-12">
											<div className="flex gap-2">
												<LayoutGrid className="text-[#9577FF] size-4" />
												{team.name}
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<NavBarTeams
												teamIdentifier={team.identifier}
												currentPage={currentPage}
												active={currentTeam?.id === team.id}
											/>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						)}
					</ScrollArea>
					<Separator className="mt-auto ml-2 w-60" />
					<div className="my-4 w-full text-center pl-4 flex justify-between gap-2">
						<Avatar>
							<AvatarImage src={user?.avatarUrl ?? ""} />
							<AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
						</Avatar>
						<Link
							href="/settings/profile"
							className="flex flex-col items-start w-1/2"
						>
							<p className="text-sm font-medium hover:text-primary/90">
								{user?.name || "User"}
							</p>
							<p className="text-xs text-muted-foreground truncate w-full">
								{user?.email || "user@example.com"}
							</p>
						</Link>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										aria-label="Logout"
										onClick={handleLogout}
									>
										<LogOut className="size-5" />
										<span className="sr-only">Logout</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="right">Logout</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
				<div className="absolute top-[100px] left-full">
					<NewIssueModal />
				</div>
			</div>
		</>
	);
};

export default Navbar;
