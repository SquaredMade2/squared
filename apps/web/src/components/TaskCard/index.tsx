"use client";

import { useState, useRef, useEffect, useContext } from "react";
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
import { SocketContext } from "@/app/SocketProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from "@/components/ui/context-menu";
import {
	useTaskStore,
	useTeamStore,
	useViewStore,
	useWorkspaceStore,
} from "@/storeZ";
import { formatUrl, truncateString } from "@/utils/formatting";
import type { Task, Label, User } from "@repo/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmCard from "@/components/DeleteConfirmCard";
import ProfileImage from "@/components/ProfileImage";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
import { high, medium, low, filterInProgress } from "@/components/Svg";
import TaskContextMenu from "../TaskContextMenu";

interface TaskCardProps {
	filteredTasks: Task[];
	setTaskData?: (task: Task) => void;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	setShowRenameModal?: (show: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
	filteredTasks,
	setTaskData,
	highlightText,
	location,
}) => {
	const router = useRouter();
	const { showDateTime, showPriority, showLabels, view } = useViewStore(
		(state) => state,
	);
	const { getAllTasks, deleteTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const { currentWorkspace, getWorkspaceLabels, workspaceLabels } =
		useWorkspaceStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const socket = useContext(SocketContext);

	const [deleteFade, setDeleteFade] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showDeleteCard, setShowDeleteCard] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

	const taskRefs = useRef<{ [key: string]: HTMLElement | null }>({});

	useEffect(() => {
		if (!workspaceLabels && currentWorkspace) {
			getWorkspaceLabels(currentWorkspace.id);
		}
	}, [currentWorkspace, getWorkspaceLabels, workspaceLabels]);

	const handleDeleteTaskCard = async (task: Task) => {
		await deleteTask(task.id);
		if (currentTeam) await getAllTasks(currentTeam.id);
		setShowDeleteCard(false);
		setDeleteFade(false);
		socket.emit("remove_notification", task.id, socket.id);
	};

	const handleCloseDeleteCard = () => {
		setShowDeleteCard(false);
		setDeleteFade(false);
	};

	const navigateToTask = (task: Task) => {
		router.push(
			`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`,
		);
	};

	const copyToClipboard = (taskId: string) => {
		navigator.clipboard.writeText(`${window.location.origin}/tasks/${taskId}`);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 3000);
	};

	const handleAssigneeChange = async (taskId: string, user: User) => {
		if (currentTeam) {
			await updateTask(taskId, { assigneeId: user.id });
			await getAllTasks(currentTeam.id);
		}
	};

	const TaskCardDate: React.FC<{
		children: React.ReactNode;
		icon: React.ReactNode;
	}> = ({ children, icon }) => (
		<div className="flex items-center gap-2 text-sm">
			{icon}
			<span>{children}</span>
		</div>
	);

	const TaskCardLabels: React.FC<{ labels: Label[]; view: string }> = ({
		labels,
		view,
	}) => {
		const isGridView = view === "grid";
		const maxLabels = isGridView ? 5 : 4;
		const maxLabelsMobile = isGridView ? 5 : 2;

		const visibleLabels = labels.slice(0, maxLabels);
		const visibleLabelsMobile = labels.slice(0, maxLabelsMobile);
		const hasMoreLabels = labels.length > maxLabels;
		const hasMoreLabelsMobile = labels.length > maxLabelsMobile;

		const renderLabels = (labelsToRender: Label[], isMobile: boolean) => (
			<>
				{labelsToRender.map((label) => (
					<div
						key={label.id}
						className={`${
							isMobile ? "flex lg:hidden" : "hidden lg:flex"
						} items-center p-1 mr-1 mb-1 border border-border rounded`}
					>
						<div
							className={`w-2 h-2 rounded-full bg-${label.color}-500 mr-1`}
						/>
						<span className="ml-1">{label.name}</span>
					</div>
				))}
				{((isMobile && hasMoreLabelsMobile) ||
					(!isMobile && hasMoreLabels)) && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className={`${isMobile ? "flex lg:hidden" : "hidden lg:flex"} items-center p-1 h-6`}
							>
								...
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{labels.slice(isGridView ? 5 : isMobile ? 2 : 4).map((label) => (
								<DropdownMenuItem key={label.id}>
									<div
										className={`w-2 h-2 rounded-full bg-${label.color}-500 mr-1`}
									/>
									<span className="ml-1">{label.name}</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</>
		);

		return (
			<div
				className={`flex items-center text-muted-foreground text-xs ${isGridView ? "flex-wrap" : "mr-5"}`}
			>
				{renderLabels(visibleLabels, false)}
				{renderLabels(visibleLabelsMobile, true)}
			</div>
		);
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

	const TaskCardStatus: React.FC<{ task: Task }> = ({ task }) => {
		const getStatusIcon = () => {
			switch (task.status) {
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

		return (
			<Button variant="ghost" size="sm" className="mx-1 p-0">
				{getStatusIcon()}
			</Button>
		);
	};

	const TaskCardTitle: React.FC<{
		task: Task;
		taskTitle: string;
		isShown: boolean;
		highlightText?: (text: string) => React.ReactNode;
		location: string;
		labels: Label[];
	}> = ({ task, taskTitle, isShown, highlightText, location, labels }) => {
		const teamIdentifier =
			location === "dashboard" ? currentTeam?.identifier : task.teamId;

		const toggleAssigneeDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			e.preventDefault();
			setShowAssigneeDropdown(!showAssigneeDropdown);
		};

		const renderTaskInfo = () => (
			<div className="flex justify-between w-full">
				<div className="flex items-center gap-2 text-base">
					{isShown && <TaskCardPriority task={task} border={false} />}
					<span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer">
						{teamIdentifier}
					</span>
					<TaskCardStatus task={task} />
					<span className="truncate">
						{location === "search" && highlightText
							? highlightText(taskTitle)
							: taskTitle}
					</span>
				</div>
				<div className="flex col-span-4 items-center lg:pr-5 justify-end">
					{showLabels && <TaskCardLabels labels={labels} view="list" />}
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
							<ProfileImage
								profileName={task.assigneeName}
								location="taskCard"
							/>
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
					? renderTaskInfo()
					: renderGridTaskInfo()}
			</div>
		);
	};

	const renderTaskCard = (task: Task, index: number) => {
		const taskLabels =
			workspaceLabels?.filter((label) => task.labels.includes(label.id)) || [];

		return (
			<Draggable draggableId={task.id} index={index} key={task.id}>
				{(provided) => (
					<div
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
					>
						<ContextMenu>
							<ContextMenuTrigger>
								<div
									ref={(el: HTMLDivElement | null) => {
										taskRefs.current[task.id] = el;
									}}
								>
									<TaskContextMenu
										task={task}
										setIsCopied={setIsCopied}
										copyToClipboard={copyToClipboard}
									/>
								</div>
								{view === "grid" ? (
									<Link
										href={`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`}
									>
										<Card className="w-[325px]">
											<CardContent className="p-4 space-y-4">
												<TaskCardTitle
													task={task}
													taskTitle={task.title}
													location={location}
													highlightText={highlightText}
													isShown={showPriority}
													labels={taskLabels}
												/>
												{showDateTime && (
													<TaskCardDate icon={<Calendar className="size-4" />}>
														Due Date:{" "}
														{task.dueDate
															? formatDate(
																	new Date(task.dueDate),
																	"M/d/yy, h:mm a",
																)
															: "No Date Set"}
													</TaskCardDate>
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
										className={`group/main grid grid-cols-24 items-center w-full py-2 bg-card border-t border-solid border-border hover:bg-accent ${index === filteredTasks.length - 1 ? "rounded-b-lg" : ""}`}
									>
										<div className="col-span-1 " />
										<div
											onClick={() => navigateToTask(task)}
											className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0"
										>
											<div className="col-span-10 text-foreground">
												<TaskCardTitle
													key={task.id}
													task={task}
													isShown={showPriority}
													taskTitle={task.title}
													location={location}
													highlightText={highlightText}
													labels={taskLabels}
												/>
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

	return (
		<>
			{filteredTasks?.map((task, index) => renderTaskCard(task, index))}
			{showDeleteCard && selectedTask && (
				<DeleteConfirmCard
					task={selectedTask}
					handleDeleteTaskCard={handleDeleteTaskCard}
					onClose={handleCloseDeleteCard}
					deleteFade={deleteFade}
				/>
			)}
		</>
	);
};

export default TaskCard;
