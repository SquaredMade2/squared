"use client";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import WorkSpaceDropDown from "@/components/WorkSpaceDropdown";
import NewIssueButton from "@/components/NewIssueButton";
import type { Team } from "@/store/taskData/taskData.interfaces";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { LayoutGrid } from "lucide-react";
import Teams from "../Teams";

const Navbar = () => {
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
	const currentYear: number = new Date().getFullYear();

	return (
		<>
			<div className="flex h-full justify-center bg-popover border-r w-64">
				<div className="w-11/12 flex flex-col">
					<div className="w-full h-full flex flex-col cursor-default text-foreground">
						<div className="h-12 flex items-center">
							<WorkSpaceDropDown />
						</div>
						<div>
							<NewIssueButton />
						</div>
						<div>
							<Accordion type="single" collapsible>
								{workspace?.teams.map((team: Team) => {
									return (
										<AccordionItem key={team._id} value={team._id}>
											<AccordionTrigger className="text-sm h-12">
												<LayoutGrid className="text-[#9577FF] size-4" />
												{team.name}
											</AccordionTrigger>
											<AccordionContent>
												<Teams />
											</AccordionContent>
										</AccordionItem>
									);
								})}
							</Accordion>
						</div>
						<div className="mt-auto mb-3 w-full text-center">
							<p className="text-muted-foreground text-xs ">
								&copy; {currentYear} Squared. All rights reserved
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
