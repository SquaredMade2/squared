"use client";
import { useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { Switch } from "../switch";
import { NewIssueDropDown } from "@/components/new-issue-dropdown";
//todo fix imports
import TodoIcon from "@/components/SVG/todo-icon";
import BacklogIcon from "../SVG/backlog-icon";
import DoneIcon from "../SVG/done-icon";
import HighPriority from "@/components/SVG/high-priority";
import MediumPriority from "@/components/SVG/medium-priority";
import UrgentPriority from "@/components/SVG/urgent-priority";
import LowEffort from "../SVG/low-effort";

export const SkeletonThree = () => {
	return (
		<div className="h-full w-full sm:w-[100%] mx-auto bg-white dark:bg-background-darkSecondary shadow-2xl dark:shadow-white/40 mt-10 group rounded-md">
			<div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white dark:from-background-darkAccent dark:via-background-darkAccent to-transparent w-full pointer-events-none z-[11]" />

			<div className="flex flex-1 w-full h-full flex-col space-y-2 ">
				<div className="flex justify-between border-b dark:border-neutral-700 pb-2 p-4">
					<p className="text-muted text-sm font-bold dark:text-muted-dark">
						LIV › New Issue
					</p>
					{/* <p className="shadow-derek text-muted dark:text-muted-dark text-sm px-2 py-1 rounded-md flex-shrink-0 flex space-x-1 items-center dark:bg-neutral-700">
            <IconPlus className="h-4 w-4 text-muted dark:text-muted-dark" />{" "}
            <span>Add</span>
          </p> */}
				</div>
				<div className="flex flex-col space-y-3 p-4">
					<div>
						<h3 className="mb-3">
							Research target audience and competitor websites
						</h3>
						{/* todo add background */}
						<input
							placeholder="Add description..."
							className="bg-transparent w-full focus:outline-none "
							type="text"
						/>
					</div>

					<div className="flex gap-7">
						<NewIssueDropDown
							options={[
								{ value: "Todo", id: 0, icon: TodoIcon },
								{ value: "Backlog", id: 1, icon: BacklogIcon },
								{ value: "Done", id: 2, icon: DoneIcon },
							]}
						/>
						{/* Priority */}
						<NewIssueDropDown
							options={[
								{ value: "Urgent", id: 0, icon: UrgentPriority },
								{ value: "High", id: 1, icon: HighPriority },
								{ value: "Medium", id: 2, icon: MediumPriority },
							]}
						/>
						{/* Effort */}
						<NewIssueDropDown
							options={[
								{ value: "Effort: 1", id: 0, icon: LowEffort },
								{ value: "Effort: 2", id: 1, icon: LowEffort },
								{ value: "Effort: 3", id: 2, icon: LowEffort },
								{ value: "Effort: 5", id: 3, icon: LowEffort },
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Row = ({
	title,
	updatedAt,
	active = false,
}: {
	title: string;
	updatedAt: string;
	active?: boolean;
}) => {
	const [checked, setChecked] = useState(active);
	return (
		<div className="flex justify-between items-center">
			<div className="flex space-x-2 items-center">
				<p className="text-muted dark:text-muted-dark text-xs shadow-aceternity dark:bg-neutral-700 px-1 py-0.5 rounded-md">
					{title}
				</p>
				<p className="text-muted dark:text-muted-dark text-xs">{updatedAt}</p>
			</div>
			<div className="flex items-center space-x-1">
				<Switch checked={checked} setChecked={setChecked} />
				<IconDots className="h-4 w-4 text-muted dark:text-muted-dark" />
			</div>
		</div>
	);
};
