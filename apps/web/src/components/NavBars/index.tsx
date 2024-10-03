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
import { LayoutGrid } from "lucide-react";
import IconLeftMenu from "../IconNavbar";
import { useTeamStore, useViewStore, useWorkspaceStore } from "@/store";
import type { Team } from "@repo/db";
import NavBarTeams from "./NavBarTeams";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const Navbar = () => {
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const { teams, getAllTeams, currentTeam } = useTeamStore((state) => state);
	const { showNavbar } = useViewStore((state) => state);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!workspace) return;
		getAllTeams(workspace.id);
	}, [workspace, getAllTeams]);

	if (!workspace) return null;

	const getCurrentPage = (path: string) => {
		if (path.endsWith("/all")) return "all";
		if (path.endsWith("/active")) return "active";
		if (path.endsWith("/backlog")) return "backlog";
		if (path.includes("/views")) return "views";
		return "";
	};

	const currentPage = getCurrentPage(pathname);

	return (
		<>
			<div className={`h-screen md:${showNavbar ? "flex" : "hidden"} hidden`}>
				<IconLeftMenu />

				<div className="flex h-full bg-popover w-64">
					<div className="w-full flex flex-col">
						<div className="w-full h-full flex flex-col cursor-default text-foreground gap-5 py-2">
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
								<Accordion
									type="single"
									collapsible
									defaultValue={currentTeam?.id}
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
							</ScrollArea>
							<div className="mt-auto mb-3 w-full text-center">
								{/* Footer content if needed */}
							</div>
						</div>
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
