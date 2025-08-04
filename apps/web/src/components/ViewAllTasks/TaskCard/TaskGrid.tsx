import { Calendar, UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent } from "@squaredmade/ui/card";
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
import {
	formatName,
	formatUrl,
	getInitials,
	truncateString,
} from "@/utils/formatting";
import type { TaskGridProps } from "./interfaces";
import { AssigneeBox, PriorityBox, StatusBox } from "./quickEditBoxes";
import TaskCardLabels from "./TaskCardLabels";

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
			className="cursor-pointer"
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
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
											<DropdownMenuContent onClick={(e) => e.preventDefault()}>
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
											<DropdownMenuContent onClick={(e) => e.preventDefault()}>
												<AssigneeBox task={task} />
											</DropdownMenuContent>
											<TooltipContent>Assign task</TooltipContent>
										</DropdownMenu>
									</Tooltip>
								</TooltipProvider>
							))}
					</div>

					<div className="flex w-full items-center gap-2 pr-8 text-sm">
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
						{truncateString(task.title, 70)}
					</div>
					<div className="-my-1 flex w-full flex-wrap items-center gap-1">
						{showDueDate && task.dueDate && (
							<div
								className={cn(
									"mb-1 flex w-fit items-center gap-2 rounded-md border border-border bg-background p-1 text-sm",
									checkOverdueDate(task.dueDate) &&
										"border-destructive text-destructive",
								)}
							>
								<Calendar className="size-4" />
								{task.dueDate
									? formatDate(new Date(task.dueDate), "MMM dd")
									: "No Date Set"}
							</div>
						)}

						{showPriority && (
							<TooltipProvider>
								<Tooltip>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<TooltipTrigger asChild>
												<Button className="mb-1 rounded-md border border-border bg-background p-1 hover:border-white h-7 hover:bg-background">
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

						{showLabels && <TaskCardLabels labels={taskLabels} />}
					</div>
					{isDisabled && (
						<span className="inline-block w-full text-end text-muted-foreground">
							BLOCKED
						</span>
					)}
				</CardContent>
			</Card>
		</Link>
	);
};

export default TaskGrid;
