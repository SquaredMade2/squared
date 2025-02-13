import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useViewStore } from "@/store";
import { formatUrl, getInitials, truncateString } from "@/utils/formatting";
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
				<CardContent className="space-y-4 p-4">
					<div className="flex h-[20px] w-full cursor-pointer justify-between">
						{showIdentifier ? (
							<p className="text-muted-foreground text-xs">{task.identifier}</p>
						) : (
							<div />
						)}
						{showAvatar &&
							(user?.name ? (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Avatar className="size-6">
												<AvatarImage src={user.avatarUrl ?? undefined} />
												<AvatarFallback className="text-xxs">
													{getInitials(user.name)}
												</AvatarFallback>
											</Avatar>
										</TooltipTrigger>
										<TooltipContent>{user.name}</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<UserSearch className="size-6 text-[#9597AD]" />
											<TooltipContent>Assign task...</TooltipContent>
										</TooltipTrigger>
									</Tooltip>
								</TooltipProvider>
							))}
					</div>

					<div className="flex w-full items-center gap-2 pr-8 text-sm">
						<StatusIcon status={task.status} />
						{truncateString(task.title, 70)}
					</div>
					<div className="-my-1 flex w-full flex-wrap items-center gap-1">
						{showDueDate && task.dueDate && (
							<div className="mb-1 flex w-fit items-center gap-2 rounded-md border border-border bg-background p-1 text-sm">
								<Calendar className="size-4" />
								{task.dueDate
									? formatDate(new Date(task.dueDate), "MMM dd")
									: "No Date Set"}
							</div>
						)}

						{showPriority && (
							<div className="mb-1 rounded-md border border-border bg-background p-1">
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
