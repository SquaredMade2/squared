import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { useState } from "react";
import { AssigneeBox } from "./AssigneeBox";
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
	const [popoverOpen, setPopoverOpen] = useState(false);

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
										<Popover open={popoverOpen}>
											<TooltipTrigger asChild>
												<PopoverTrigger asChild>
													<Avatar
														className="size-6"
														onClick={(e) => {
															e.preventDefault();
															setPopoverOpen(!popoverOpen);
														}}
													>
														<AvatarImage src={user.avatarUrl ?? undefined} />
														<AvatarFallback className="text-xxs">
															{getInitials(user.name)}
														</AvatarFallback>
													</Avatar>
												</PopoverTrigger>
											</TooltipTrigger>
											<TooltipContent>{user.name}</TooltipContent>
											<PopoverContent
												className="w-48"
												onClick={(e) => e.preventDefault()}
												onBlur={() => setPopoverOpen(false)}
											>
												<AssigneeBox
													task={task}
													closeMenu={() => setPopoverOpen(false)}
												/>
											</PopoverContent>
										</Popover>
									</Tooltip>
								</TooltipProvider>
							) : (
								<TooltipProvider>
									<Tooltip>
										<Popover open={popoverOpen}>
											<TooltipTrigger asChild>
												<PopoverTrigger>
													<UserSearch
														className="size-6 text-[#9597AD]"
														onClick={(e) => {
															e.preventDefault();
															setPopoverOpen(!popoverOpen);
														}}
													/>
													<TooltipContent>Assign task</TooltipContent>
												</PopoverTrigger>
											</TooltipTrigger>
											<PopoverContent
												className="w-48"
												onClick={(e) => e.preventDefault()}
												onBlur={() => setPopoverOpen(false)}
											>
												<AssigneeBox
													task={task}
													closeMenu={() => setPopoverOpen(false)}
												/>
											</PopoverContent>
										</Popover>
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
