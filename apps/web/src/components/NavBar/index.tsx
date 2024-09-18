"use client";

import WorkSpaceDropDown from "@/components/WorkSpaceDropdown";
import NewIssueModal from "../NewIssueModal";
import NewIssueButton from "@/components/NewIssueButton";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { LayoutGrid } from "lucide-react";
import IconLeftMenu from "../IconLeftMenu";
import { useTeamStore, useWorkspaceStore } from "@/store";
import { useEffect } from "react";
import type { Team } from "@repo/db";
import NavBarTeams from "../NavBarTeams";
import { ScrollArea } from "../ui/scroll-area";

const Navbar = () => {
	const workspace = useWorkspaceStore((state) => state.currentWorkspace);
	const currentYear: number = new Date().getFullYear();
	const { teams, getAllTeams } = useTeamStore((state) => state);
	useEffect(() => {
		if (!workspace) return;
		getAllTeams(workspace.id);
	}, []);

	return (
		<>
			<div className="h-screen flex">
				<div className="w-12 bg-secondary">
					<IconLeftMenu />
				</div>
				<div className="flex h-full justify-center bg-popover w-64">
					<div className="w-full flex flex-col">
						<div className="w-full h-full flex flex-col gap-5 mt-2 cursor-default text-foreground">
							<div className="h-12 flex items-center px-2">
								<WorkSpaceDropDown />
							</div>
							<div className="px-2">
								<NewIssueButton />
							</div>
							<ScrollArea className="max-h-full">
								<div className="px-2">
									<Accordion type="single" collapsible>
										{teams?.map((team: Team) => {
											return (
												<AccordionItem key={team.id} value={team.id}>
													<AccordionTrigger className="text-sm h-12">
														<LayoutGrid className="text-[#9577FF] size-4" />
														{team.name}
													</AccordionTrigger>
													<AccordionContent>
														<NavBarTeams
															onDropdownClick={() => {}}
															teamIdentifier={team.identifier}
														/>
													</AccordionContent>
												</AccordionItem>
											);
										})}
									</Accordion>
								</div>
							</ScrollArea>
							<div className="mt-auto mb-5 w-full text-center">
								<p className="text-muted-foreground text-xs">
									&copy; {currentYear} Squared. All rights reserved
								</p>
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
