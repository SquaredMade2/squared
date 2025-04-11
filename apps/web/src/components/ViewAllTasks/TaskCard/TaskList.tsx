import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { useViewStore } from "@/store";
import { formatName, formatUrl, getInitials } from "@/utils/formatting";
import { UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { checkOverdueDate } from "@/utils/checkOverdueDate";
import { cn } from "@/utils/cn";
import { formatDate } from "date-fns";
import Link from "next/link";
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
								<span className="xs:hidden min-w-28 shrink-0 cursor-pointer text-muted-foreground sm:hidden md:flex">
									{task.identifier}
								</span>
							)}
							{showStatus && (
								<Button variant="ghost" size="sm" className="mx-1 shrink-0 p-0">
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
								<div
									className={cn(
										"xs:hidden shrink-0 whitespace-nowrap sm:hidden md:flex",
										checkOverdueDate(task.dueDate) && "text-destructive",
									)}
								>
									{task.dueDate
										? formatDate(new Date(task.dueDate), "MMM dd")
										: "No Date"}
								</div>
							)}
							{showAvatar &&
								(user ? (
									<TooltipProvider>
										<Tooltip>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<TooltipTrigger asChild>
														<Avatar
															className="size-6 shrink-0"
															onClick={(e) => {
																e.preventDefault();
															}}
														>
															<AvatarImage src={user.imageUrl} />
															<AvatarFallback className="text-xxs">
																{getInitials(formatName(user))}
															</AvatarFallback>
														</Avatar>
													</TooltipTrigger>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													onClick={(e) => e.preventDefault()}
												>
													<AssigneeBox task={task} />
												</DropdownMenuContent>
												<TooltipContent>{formatName(user)}</TooltipContent>
											</DropdownMenu>
										</Tooltip>
									</TooltipProvider>
								) : (
									<TooltipProvider>
										<Tooltip>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<TooltipTrigger asChild>
														<UserSearch
															className="size-6 shrink-0 text-[#9597AD]"
															onClick={(e) => {
																e.preventDefault();
															}}
														/>
													</TooltipTrigger>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													onClick={(e) => e.preventDefault()}
												>
													<AssigneeBox task={task} />
												</DropdownMenuContent>
												<TooltipContent>Assign task</TooltipContent>
											</DropdownMenu>
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
