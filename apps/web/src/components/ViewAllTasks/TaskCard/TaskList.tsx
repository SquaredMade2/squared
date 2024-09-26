import { UserSearch } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useViewStore, useWorkspaceStore } from "@/store";
import TaskCardLabels from "./TaskCardLabels";
import { formatDate } from "date-fns";
import { formatUrl, getInitials } from "@/utils/formatting";
import Link from "next/link";
import type { TaskListProps } from "./interfaces";
import { PriorityIcon, StatusIcon } from "@/components/Icons";

const TaskList = ({
	teamIdentifier,
	highlightText,
	location,
	task,
	user,
	currentTeam,
}: TaskListProps) => {
	const { listViewOptions } = useViewStore((state) => state);

	const {
		identifier: showIdentifier,
		dueDate: showDueDate,
		assigneeAvatar: showAssigneeAvatar,
		labels: showLabels,
		status: showStatus,
		priority: showPriority,
	} = listViewOptions.displayProperties;

	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const taskLabels =
		currentWorkspace?.Labels.filter((label) =>
			task.labels.includes(label.id),
		) || [];
	return (
		<Link
			className={
				"group/main grid grid-cols-24 items-center w-full py-2 bg-card border-t border-solid border-border hover:bg-accent"
			}
			href={`/${currentTeam?.name}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1 min-h-9" />
			<div className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex justify-between w-full">
						<div className="flex items-center gap-2 text-base min-w-0">
							{showPriority && <PriorityIcon priority={task.priority} />}
							{showIdentifier && (
								<span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer flex-shrink-0">
									{teamIdentifier}
								</span>
							)}
							{showStatus && (
								<Button
									variant="ghost"
									size="sm"
									className="mx-1 p-0 flex-shrink-0"
								>
									<StatusIcon status={task.status} />
								</Button>
							)}
							<span className="truncate min-w-0">
								{location === "search" && highlightText
									? highlightText(task.title)
									: task.title}
							</span>
						</div>
						<div className="flex col-span-4 items-center lg:pr-5 justify-end gap-2">
							{showLabels && <TaskCardLabels labels={taskLabels} view="list" />}
							{showDueDate && (
								<div className="text-muted-foreground md:flex xs:hidden sm:hidden flex-shrink-0 whitespace-nowrap">
									{task.dueDate
										? formatDate(new Date(task.dueDate), "MMM dd")
										: "No Date"}
								</div>
							)}
							{showAssigneeAvatar &&
								(task.assigneeName ? (
									<Avatar className="size-6 flex-shrink-0">
										<AvatarImage src={user?.avatarUrl ?? undefined} />
										<AvatarFallback className="text-xxs">
											{getInitials(task.assigneeName)}
										</AvatarFallback>
									</Avatar>
								) : (
									<UserSearch className="size-6 text-[#9597AD] flex-shrink-0" />
								))}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default TaskList;
