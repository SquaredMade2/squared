import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { useViewStore } from "@/store";
import { formatUrl, getInitials, truncateString } from "@/utils/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Card, CardContent } from "@squaredmade/ui/card";
import { formatDate } from "date-fns";
import { Calendar, UserSearch } from "lucide-react";
import Link from "next/link";
import TaskCardLabels from "./TaskCardLabels";
import type { TaskGridProps } from "./interfaces";

const TaskGrid = ({
	task,
	user,
	taskLabels,
	currentWorkspaceUrl,
	isSubtask = false,
	isDisabled = false,
}: TaskGridProps) => {
	const { getGridOptions } = useViewStore((state) => state);

	const {
		identifier: showIdentifier,
		dueDate: showDueDate,
		avatar: showAvatar,
		labels: showLabels,
		priority: showPriority,
	} = getGridOptions().displayProperties;

	return (
		<Link
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
			className="cursor-pointer"
		>
			<Card className={`w-full ${isSubtask ? "bg-secondary/30" : ""}`}>
				<CardContent className="p-4 space-y-4">
					<div className="flex justify-between h-[20px] w-full cursor-pointer">
						{showIdentifier ? (
							<p className="text-xs text-muted-foreground">{task.identifier}</p>
						) : (
							<div />
						)}
						{showAvatar &&
							(user?.name ? (
								<Avatar className="size-6">
									<AvatarImage src={user.avatarUrl ?? undefined} />
									<AvatarFallback className="text-xxs">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
							) : (
								<UserSearch className="size-6 text-[#9597AD]" />
							))}
					</div>

					<div className="text-sm pr-8 w-full flex items-center gap-2">
						<StatusIcon status={task.status} />
						{truncateString(task.title, 70)}
					</div>
					<div className="flex flex-wrap w-full items-center gap-1 -my-1">
						{showDueDate && task.dueDate && (
							<div className="flex items-center gap-2 text-sm bg-background border border-border rounded-md w-fit p-1 mb-1">
								<Calendar className="size-4" />
								{task.dueDate
									? formatDate(new Date(task.dueDate), "MMM dd")
									: "No Date Set"}
							</div>
						)}

						{showPriority && (
							<div className="bg-background border border-border rounded-md p-1 mb-1">
								<PriorityIcon priority={task.priority} />
							</div>
						)}

						{showLabels && <TaskCardLabels labels={taskLabels} />}
					</div>
					{isDisabled && <span className="text-muted-foreground">BLOCKED</span>}
				</CardContent>
			</Card>
		</Link>
	);
};

export default TaskGrid;
