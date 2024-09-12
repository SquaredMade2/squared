"use client";

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Draggable } from "@hello-pangea/dnd";
import {
	Calendar,
	UserSearch,
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
	Ellipsis,
} from "lucide-react";
import { formatDate } from "date-fns/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
	useTaskStore,
	useTeamStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/storeZ";
import { formatUrl, truncateString } from "@/utils/formatting";
import type { Task, Label, User, Status } from "@repo/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import ProfileImage from "@/components/ProfileImage";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
import { high, medium, low, filterInProgress } from "@/components/Svg";
import TaskContextMenu from "../TaskContextMenu";
import TaskCardLabels from "../TaskCardLabels";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@repo/ui/avatar";

interface TaskCardProps {
	task: Task;
	index: number;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	setTaskData?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
	task,
	index,
	highlightText,
	location,
	setTaskData,
}) => {
	const router = useRouter();
	const { showDateTime, showPriority, showLabels, view } = useViewStore(
		(state) => state,
	);
	const { updateTask } = useTaskStore((state) => state);
	const { currentWorkspace, workspaceLabels } = useWorkspaceStore(
		(state) => state,
	);
	const { users } = useUserStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);

	const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const navigateToTask = () => {
		router.push(
			`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`,
		);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(`${window.location.origin}/tasks/${task.id}`);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 3000);
	};

	const handleAssigneeChange = async (user: string) => {
		await updateTask(task.id, { assigneeId: user });
	};

	const TaskCardPriority: React.FC<{ task: Task; border: boolean }> = ({
		task,
		border,
	}) => {
		const getPriorityIcon = () => {
			switch (task.priority) {
				case "low":
					return low();
				case "medium":
					return medium();
				case "high":
					return high();
				case "urgent":
					return (
						<FontAwesomeIcon
							className="text-muted-foreground"
							icon={faExclamation}
						/>
					);
				default:
					return <Ellipsis className="size-4" />;
			}
		};

		return (
			<Button
				variant="ghost"
				size="sm"
				className={`p-0.5 ${border ? "border border-border mb-2 mt-1 w-6 h-5" : "w-5 h-5"}`}
			>
				{getPriorityIcon()}
			</Button>
		);
	};

	const getStatusIcon = (status: Status) => {
		switch (status) {
			case "backlog":
				return <CircleDashed className="size-4" />;
			case "todo":
				return <Circle className="size-4" />;
			case "inProgress":
				return filterInProgress();
			case "inReview":
				return <CircleFadingPlus className="size-4 text-green-400" />;
			case "done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
			default:
				return <Circle className="size-4" />;
		}
	};

	const TaskCardTitle = () => {
		const teamIdentifier =
			location === "dashboard" ? currentTeam?.identifier : task.teamId;

		const toggleAssigneeDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			e.preventDefault();
			setShowAssigneeDropdown(!showAssigneeDropdown);
		};

		const renderListTaskInfo = () => (
			<div className="flex justify-between w-full">
				<div className="flex items-center gap-2 text-base">
					{showPriority && <TaskCardPriority task={task} border={false} />}
					<span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer">
						{teamIdentifier}
					</span>
					<Button variant="ghost" size="sm" className="mx-1 p-0">
						{getStatusIcon(task.status)}
					</Button>
					<span className="truncate">
						{location === "search" && highlightText
							? highlightText(task.title)
							: task.title}
					</span>
				</div>
				<div className="flex col-span-4 items-center lg:pr-5 justify-end">
					{showLabels && <TaskCardLabels labels={taskLabels} view="list" />}
					{showDateTime && (
						<div className="text-muted-foreground md:flex xs:hidden sm:hidden mr-2 mdsm:mr-3">
							{task.dueDate
								? formatDate(new Date(task.dueDate), "MMM dd")
								: "No Date"}
						</div>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleAssigneeDropdown}
						className="p-0"
					>
						{task.assigneeName ? (
							<Avatar>
								<AvatarImage
									src={
										users.filter((u) => u.id === task.assigneeId)[0]
											.avatarUrl ?? undefined
									}
								/>
								<AvatarFallback>{task.assigneeName}</AvatarFallback>
							</Avatar>
						) : (
							<UserSearch className="size-5 text-[#9597AD]" />
						)}
					</Button>
					{showAssigneeDropdown && (
						<div className="absolute mr-40 mt-10 cursor-pointer">
							<AssigneeDropdown
								taskId={task.id}
								location="Dashboard"
								setShowAssigneeDropdown={setShowAssigneeDropdown}
								handleAssigneeChange={handleAssigneeChange}
							/>
						</div>
					)}
				</div>
			</div>
		);

		const renderGridTaskInfo = () => (
			<>
				<div className="flex justify-between h-[20px] w-full cursor-pointer">
					<p className="text-xs text-muted-foreground">{teamIdentifier}</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleAssigneeDropdown}
						className="p-0"
					>
						{task.assigneeName ? (
							<ProfileImage
								profileName={task.assigneeName}
								location="taskCard"
							/>
						) : (
							<UserSearch className="size-5 text-[#9597AD]" />
						)}
					</Button>
				</div>
				<div className="text-sm pr-8 cursor-pointer w-full">
					{truncateString(task.title, 70)}
				</div>
				{showAssigneeDropdown && (
					<AssigneeDropdown
						taskId={task.id}
						location="Grid"
						setShowAssigneeDropdown={setShowAssigneeDropdown}
						handleAssigneeChange={handleAssigneeChange}
					/>
				)}
			</>
		);

		return (
			<div
				className={`flex flex-col items-start justify-evenly cursor-pointer ${view === "list" || location === "search" ? "py-1" : ""}`}
			>
				{view === "list" || location === "search"
					? renderListTaskInfo()
					: renderGridTaskInfo()}
			</div>
		);
	};

	const taskLabels =
		workspaceLabels?.filter((label) => task.labels.includes(label.id)) || [];

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					<ContextMenu>
						<ContextMenuTrigger>
							<TaskContextMenu
								task={task}
								setIsCopied={setIsCopied}
								copyToClipboard={copyToClipboard}
							/>
							{view === "grid" ? (
								<Link
									href={`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`}
								>
									<Card className="w-[325px]">
										<CardContent className="p-4 space-y-4">
											<TaskCardTitle />
											{showDateTime && (
												<div className="flex items-center gap-2 text-sm">
													<Calendar className="size-4" />
													<span>
														Due Date:{" "}
														{task.dueDate
															? formatDate(
																	new Date(task.dueDate),
																	"M/d/yy, h:mm a",
																)
															: "No Date Set"}
													</span>
												</div>
											)}
											<div className="flex items-center space-x-4">
												{showPriority && (
													<TaskCardPriority border={true} task={task} />
												)}
												{showLabels && (
													<TaskCardLabels labels={taskLabels} view="grid" />
												)}
											</div>
										</CardContent>
									</Card>
								</Link>
							) : (
								<div
									className={
										"group/main grid grid-cols-24 items-center w-full py-2 bg-card border-t border-solid border-border hover:bg-accent"
									}
									onClick={() => navigateToTask()}
								>
									<div className="col-span-1" />
									<div className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0">
										<div className="col-span-10 text-foreground">
											<TaskCardTitle />
										</div>
									</div>
								</div>
							)}
						</ContextMenuTrigger>
					</ContextMenu>
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
