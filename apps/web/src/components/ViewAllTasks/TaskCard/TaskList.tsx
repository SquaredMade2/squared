import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { formatUrl, getInitials } from "@/utils/formatting";
import { formatDate } from "date-fns";
import { UserSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AssigneeBox } from "./AssigneeBox";
import TaskCardLabels from "./TaskCardLabels";
import type { TaskListProps } from "./interfaces";

const TaskList = ({
	highlightText,
	location,
	task,
	user,
	currentWorkspaceUrl,
	taskLabels,
}: TaskListProps) => {
	const { getListOptions } = useViewStore((state) => state);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const {
		identifier: showIdentifier,
		dueDate: showDueDate,
		avatar: showAvatar,
		labels: showLabels,
		status: showStatus,
		priority: showPriority,
	} = getListOptions().displayProperties;

	return (
		<Link
			className={
				"group/main grid w-full grid-cols-24 items-center border-border border-t border-solid bg-card py-2 hover:bg-accent"
			}
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1 min-h-9" />
			<div className="col-span-23 grid grid-cols-10 pr-6 pl-2 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex w-full justify-between">
						<div className="flex min-w-0 items-center gap-2 text-base">
							{showPriority && <PriorityIcon priority={task.priority} />}
							{showIdentifier && (
								<span className="xs:hidden min-w-28 flex-shrink-0 cursor-pointer text-muted-foreground sm:hidden md:flex">
									{task.identifier}
								</span>
							)}
							{showStatus && (
								<Button
									variant="ghost"
									size="sm"
									className="mx-1 flex-shrink-0 p-0"
								>
									<StatusIcon status={task.status} />
								</Button>
							)}
							<span className="min-w-0 truncate">
								{location === "search" && highlightText
									? highlightText(task.title)
									: task.title}
							</span>
						</div>
						<div className="col-span-4 flex items-center justify-end gap-2 lg:pr-5">
							{showLabels && <TaskCardLabels labels={taskLabels} />}
							{showDueDate && (
								<div className="xs:hidden flex-shrink-0 whitespace-nowrap text-muted-foreground sm:hidden md:flex">
									{task.dueDate
										? formatDate(new Date(task.dueDate), "MMM dd")
										: "No Date"}
								</div>
							)}
							{showAvatar &&
								(user?.name ? (
									<TooltipProvider>
										<Tooltip>
											<Popover open={popoverOpen}>
												<TooltipTrigger asChild>
													<PopoverTrigger asChild>
														<Avatar
															className="size-6 flex-shrink-0"
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
															className="size-6 flex-shrink-0 text-[#9597AD]"
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
					</div>
				</div>
			</div>
		</Link>
	);
};

export default TaskList;
