import type React from "react";
import { Calendar, UserSearch } from "lucide-react";

import { formatUrl, getInitials, truncateString } from "@/utils/formatting";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "date-fns";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { useViewStore } from "@/storeZ";
import TaskCardLabels from "../TaskCardLabels";
import type { TaskGridProps } from "./interfaces";

const TaskGrid = ({
	teamIdentifier,
	task,
	user,
	currentTeam,
	priorityIcon,
	taskLabels,
}: TaskGridProps) => {
	const { showDateTime, showPriority, showLabels } = useViewStore(
		(state) => state,
	);
	return (
		<Link
			href={`/${currentTeam?.name}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<Card className="w-80">
				<CardContent className="p-4 space-y-4">
					<div className="flex justify-between h-[20px] w-full cursor-pointer">
						<p className="text-xs text-muted-foreground">{teamIdentifier}</p>
						{task.assigneeName ? (
							<Avatar className="size-6">
								<AvatarImage src={user?.avatarUrl ?? undefined} />
								<AvatarFallback className="text-xxs">
									{getInitials(task.assigneeName)}
								</AvatarFallback>
							</Avatar>
						) : (
							<UserSearch className="size-6 text-[#9597AD]" />
						)}
					</div>
					<div className="text-sm pr-8 cursor-pointer w-full">
						{truncateString(task.title, 70)}
					</div>
					{showDateTime && (
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="size-4" />
							<span>
								Due Date:{" "}
								{task.dueDate
									? formatDate(new Date(task.dueDate), "M/d/yy, h:mm a")
									: "No Date Set"}
							</span>
						</div>
					)}
					<div className="flex items-center space-x-4">
						{showPriority && (
							<Button
								variant="ghost"
								size="sm"
								className={"p-0.5 border border-border mb-2 mt-1 w-6 h-5"}
							>
								{priorityIcon}
							</Button>
						)}
						{showLabels && <TaskCardLabels labels={taskLabels} view="grid" />}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default TaskGrid;
