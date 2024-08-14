"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { usePathname, useRouter } from "next/navigation";
import { setCurrentTeam } from "@/store/taskData";
import NewIssueModal from "@/components/NewIssueModal";
import WorkSpaceDropDown from "@/components/WorkSpaceDropdown";
import NewIssueButton from "@/components/NewIssueButton";
import NavBarTeams from "@/components/NavBarTeams";
import { LayoutGrid } from "lucide-react";
import type { Team } from "@/store/taskData/taskData.interfaces";
import SearchButton from "../SearchButton";
import SearchCommand from "../SearchCommand";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

const Navbar = () => {
	const [isSearchCommand, setIsSearchCommand] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const pathname = usePathname();
	const inboxPageChecker = pathname.includes("/inbox");
	const { user } = useAppSelector((state) => state.userSettings);
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);

	const handleTeamClick = (team: Team): void => {
		dispatch(setCurrentTeam(team));
		router.push(`/workspace/${workspace.url}/team/${team.identifier}/all`);
	};

	return (
		<div className="flex flex h-full justify-center bg-popover border-r w-[296px]">
			<div className="w-11/12 flex flex-col">
				<div className="flex flex-col gap-4 lg:pt-1.5 pt-6 items-center text-nav w-full">
					<div className="flex flex-row items-center cursor-pointer relative w-full">
						<div className="w-full ml-1.5">
							<span className="relative">
								<WorkSpaceDropDown />
							</span>
						</div>
					</div>
					<span className="text-sm m-2 text-popover-foreground font-semibold">
						{user?.name}
					</span>
					<div className="flex flex-row w-full justify-around ml-2">
						<NewIssueButton />
						<SearchButton setIsSearchCommand={setIsSearchCommand} />
					</div>
				</div>
				<div className="w-full h-full left-5 mt-10 cursor-default text-foreground">
					<div
						className={`w-full flex items-center my-1.5 rounded-md mr-3 w-full flex items-center h-9 hover:bg-secondary rounded-md cursor-pointer ${
							inboxPageChecker && "bg-secondary"
						}`}
						onClick={() => {
							router.push(`/workspace/${workspace.url}/inbox`);
						}}
					>
						<div className="text-sm m-2 text-popover-foreground font-semibold">
							Inbox
						</div>
					</div>

					<div className="w-full flex items-center my-1.5 rounded-md mr-3">
						<span className="text-sm m-2 text-popover-foreground font-semibold">
							Your teams
						</span>
					</div>
					<Accordion type="single" collapsible>
						{workspace?.teams.map((team: Team) => {
							return (
								<AccordionItem key={team._id} value={team._id}>
									<AccordionTrigger>
										<LayoutGrid className="text-[#9577FF] size-4" />
										{team.name}
									</AccordionTrigger>
									<AccordionContent>
										<NavBarTeams
											id={team._id}
											teamName={team.name}
											onDropdownClick={() => handleTeamClick(team)}
											teamIdentifier={team.identifier}
										/>
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				</div>
				<div className="absolute top-[100px] left-full">
					<NewIssueModal />
				</div>
				<div className="absolute top-[100px] left-full">
					<SearchCommand
						isSearchCommand={isSearchCommand}
						setIsSearchCommand={setIsSearchCommand}
					/>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
