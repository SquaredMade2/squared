import { UserSearch } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import type React from "react";
import { useViewStore, useWorkspaceStore } from "@/storeZ";
import TaskCardLabels from "../TaskCardLabels";
import { formatDate } from "date-fns";
import { formatUrl, getInitials } from "@/utils/formatting";
import Link from "next/link";
import type { TaskListProps } from "./interfaces";

const TaskList = ({
	priorityIcon,
	teamIdentifier,
	statusIcon,
	highlightText,
	location,
	task,
	user,
	currentTeam,
}: TaskListProps) => {
	const { showPriority, showLabels, showDateTime } = useViewStore(
		(state) => state,
	);
	const { workspaceLabels } = useWorkspaceStore((state) => state);
	const taskLabels =
		workspaceLabels?.filter((label) => task.labels.includes(label.id)) || [];
	return (
		<Link
			className={
				"group/main grid grid-cols-24 items-center w-full py-2 bg-card border-t border-solid border-border hover:bg-accent"
			}
			href={`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1" />
			<div className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex justify-between w-full">
						<div className="flex items-center gap-2 text-base">
							{showPriority && (
								<Button
									variant="ghost"
									size="sm"
									className={"p-0.5 border border-border mb-2 mt-1 w-6 h-5"}
								>
									{priorityIcon}
								</Button>
							)}
							<span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer">
								{teamIdentifier}
							</span>
							<Button variant="ghost" size="sm" className="mx-1 p-0">
								{statusIcon}
							</Button>
							<span className="truncate">
								{location === "search" && highlightText
									? highlightText(task.title)
									: task.title}
							</span>
						</div>
						<div className="flex col-span-4 items-center lg:pr-5 justify-end">
							{showLabels && <TaskCardLabels labels={taskLabels} view="list" />}
							{showDateTime && (
								<div className="text-muted-foreground md:flex xs:hidden sm:hidden mr-2 mdsm:mr-3">
									{task.dueDate
										? formatDate(new Date(task.dueDate), "MMM dd")
										: "No Date"}
								</div>
							)}
							<Button variant="ghost" size="sm" className="p-0">
								{task.assigneeName ? (
									<Avatar>
										<AvatarImage src={user?.avatarUrl ?? undefined} />
										<AvatarFallback>
											{getInitials(task.assigneeName)}
										</AvatarFallback>
									</Avatar>
								) : (
									<UserSearch className="size-5 text-[#9597AD]" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default TaskList;
