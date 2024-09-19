// "use client";

// import WorkSpaceDropDown from "@/components/WorkSpaceDropdown";
// import NewIssueModal from "../NewIssueModal";
// import NewIssueButton from "@/components/NewIssueButton";
// import {
// 	Accordion,
// 	AccordionContent,
// 	AccordionItem,
// 	AccordionTrigger,
// } from "../ui/accordion";
// import { LayoutGrid } from "lucide-react";
// import IconLeftMenu from "../IconLeftMenu";
// import { useTeamStore, useWorkspaceStore } from "@/store";
// import { useEffect } from "react";
// import type { Team } from "@repo/db";
// import NavBarTeams from "../NavBarTeams";
// import { Button } from "../ui/button";
// import { useRouter } from "next/navigation";
// import { ScrollArea } from "../ui/scroll-area";

// const Navbar = () => {
// 	const workspace = useWorkspaceStore((state) => state.currentWorkspace);
// 	const currentYear: number = new Date().getFullYear();
// 	const router = useRouter();
// 	const { teams, getAllTeams } = useTeamStore((state) => state);
// 	useEffect(() => {
// 		if (!workspace) return;
// 		getAllTeams(workspace.id);
// 	}, []);

// 	return (
// 		<>
// 			<div className="h-screen flex">
// 				<IconLeftMenu />

// 				<div className="flex h-full bg-popover w-64 ">
// 					<div className="flex flex-col">
// 						<div className="w-auto h-full border flex flex-col cursor-default text-foreground gap-4 py-2">
// 							<WorkSpaceDropDown />
// 							<NewIssueButton />
// 							<Button
// 								variant="ghost"
// 								size="sm"
// 								className="justify-start"
// 								onClick={() => router.push(`/${workspace?.url}/my-issues`)}
// 							>
// 								My Issues
// 							</Button>
// 							<ScrollArea>
// 								<Accordion type="single" collapsible>
// 									{teams?.map((team: Team) => {
// 										return (
// 											<AccordionItem key={team.id} value={team.id}>
// 												<AccordionTrigger className="text-sm h-12">
// 													<LayoutGrid className="text-[#9577FF] size-4" />
// 													{team.name}
// 												</AccordionTrigger>
// 												<AccordionContent>
// 													<NavBarTeams teamIdentifier={team.identifier} />
// 												</AccordionContent>
// 											</AccordionItem>
// 										);
// 									})}
// 								</Accordion>
// 							</ScrollArea>
// 							<div className="mt-auto mb-3 w-full text-center">
// 								<p className="text-muted-foreground text-xs ">
// 									&copy; {currentYear} Squared. All rights reserved
// 								</p>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="absolute top-[100px] left-full">
// 					<NewIssueModal />
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Navbar;

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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

const Navbar = () => {
	const workspace = useWorkspaceStore((state) => state.currentWorkspace);
	const currentYear: number = new Date().getFullYear();
	const router = useRouter();
	const { teams, getAllTeams } = useTeamStore((state) => state);
	useEffect(() => {
		if (!workspace) return;
		getAllTeams(workspace.id);
	}, []);

	return (
		<>
			<div className="h-screen flex">
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
									onClick={() => router.push(`/${workspace?.url}/my-issues`)}
								>
									My Issues
								</Button>
							</div>
							<ScrollArea className="px-2">
								<Accordion type="single" collapsible>
									{teams?.map((team: Team) => {
										return (
											<AccordionItem key={team.id} value={team.id}>
												<AccordionTrigger className="text-sm h-12">
													<div className="flex gap-2">
														<LayoutGrid className="text-[#9577FF] size-4" />
														{team.name}
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<NavBarTeams teamIdentifier={team.identifier} />
												</AccordionContent>
											</AccordionItem>
										);
									})}
								</Accordion>
							</ScrollArea>
							<div className="mt-auto mb-3 w-full text-center">
								{/* <p className="text-muted-foreground text-xs ">
									&copy; {currentYear} Squared. All rights reserved
								</p> */}
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
