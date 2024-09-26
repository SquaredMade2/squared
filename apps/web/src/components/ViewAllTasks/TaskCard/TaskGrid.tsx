import { Calendar, UserSearch } from "lucide-react";

import { formatUrl, getInitials, truncateString } from "@/utils/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useViewStore } from "@/store";
import TaskCardLabels from "./TaskCardLabels";
import type { TaskGridProps } from "./interfaces";
import { PriorityIcon } from "@/components/Icons";

const TaskGrid = ({
	teamIdentifier,
	task,
	user,
	currentTeam,
	taskLabels,
}: TaskGridProps) => {
	const { gridViewOptions } = useViewStore((state) => state);

	const {
		priority: showPriority,
		dueDate: showDueDate,
		labels: showLabels,
	} = gridViewOptions.displayProperties;

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
					{showDueDate && (
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
					<div className="flex items-end space-x-4">
						{showPriority && <PriorityIcon priority={task.priority} />}
						{showLabels && <TaskCardLabels labels={taskLabels} view="grid" />}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default TaskGrid;
