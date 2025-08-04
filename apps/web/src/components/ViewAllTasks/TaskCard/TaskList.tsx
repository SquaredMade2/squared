import { UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
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
import { formatDate } from "date-fns";
import Link from "next/link";
import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { useViewStore } from "@/store";
import { checkOverdueDate } from "@/utils/checkOverdueDate";
import { formatName, formatUrl, getInitials } from "@/utils/formatting";
import type { TaskListProps } from "./interfaces";
import { AssigneeBox, DateBox, PriorityBox, StatusBox } from "./quickEditBoxes";
import TaskCardLabels from "./TaskCardLabels";

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
			className="group/main grid w-full grid-cols-24 items-center border-border border-t border-solid bg-card py-2 hover:bg-accent"
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1 min-h-9" />
			<div className="col-span-23 grid grid-cols-10 pr-6 pl-2 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex w-full justify-between">
						<div className="flex min-w-0 items-center gap-2 text-base">
							{showPriority && (
								<TooltipProvider>
									<Tooltip>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<TooltipTrigger asChild>
													<Button className="rounded-md border border-border bg-background p-1 hover:border-white h-7 hover:bg-background">
														<PriorityIcon priority={task.priority} />
													</Button>
												</TooltipTrigger>
											</DropdownMenuTrigger>
											<DropdownMenuContent onClick={(e) => e.preventDefault()}>
												<PriorityBox task={task} />
											</DropdownMenuContent>
											<TooltipContent>Priority: {task.priority}</TooltipContent>
										</DropdownMenu>
									</Tooltip>
								</TooltipProvider>
							)}
							{showIdentifier && (
								<span className="xs:hidden min-w-28 shrink-0 cursor-pointer text-muted-foreground sm:hidden md:flex">
									{task.identifier}
								</span>
							)}
							{showStatus && (
								<TooltipProvider>
									<Tooltip>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<TooltipTrigger asChild>
													<Button
														className="h-6 shrink-0 py-3 px-1 border rounded-xl hover:border-white hover:bg-transparent"
														size="lg"
														variant="ghost"
													>
														<StatusIcon status={task.status} />
													</Button>
												</TooltipTrigger>
											</DropdownMenuTrigger>
											<DropdownMenuContent onClick={(e) => e.preventDefault()}>
												<StatusBox task={task} />
											</DropdownMenuContent>
											<TooltipContent>Status: {task.status}</TooltipContent>
										</DropdownMenu>
									</Tooltip>
								</TooltipProvider>
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
								<TooltipProvider>
									<Tooltip>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<TooltipTrigger asChild>
													<Button
														className={cn(
															"xs:hidden shrink-0 whitespace-nowrap rounded-md border border-border p-1 sm:hidden md:flex hover:border-white bg-transparent hover:bg-transparent text-white",
															checkOverdueDate(task.dueDate) &&
																"border-destructive text-destructive",
														)}
													>
														{task.dueDate
															? formatDate(new Date(task.dueDate), "MMM dd")
															: "No Date"}
													</Button>
												</TooltipTrigger>
											</DropdownMenuTrigger>
											<DropdownMenuContent onClick={(e) => e.preventDefault()}>
												<DateBox task={task} />
											</DropdownMenuContent>
											<TooltipContent>Due Date</TooltipContent>
										</DropdownMenu>
									</Tooltip>
								</TooltipProvider>
							)}
							{showAvatar &&
								(user ? (
									<TooltipProvider>
										<Tooltip>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<TooltipTrigger asChild>
														<Avatar className="size-7 shrink-0 border-2 hover:border-white">
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
														<Button className="border-2 hover:border-white rounded-3xl bg-transparent hover:bg-transparent px-1 h-7">
															<UserSearch className="size-7 shrink-0 text-[#9597AD]" />
														</Button>
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
