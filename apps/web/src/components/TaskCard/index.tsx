"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Draggable } from "@hello-pangea/dnd";
import DeleteConfirmCard from "@/components/DeleteConfirmCard";
import { Calendar, GripVertical } from "lucide-react";
import TaskCardTitle from "@/components/TaskCardTitle";
import TaskCardPriority from "@/components/TaskCardPriority";
import TaskCardLabels from "@/components/TaskCardLabels";
import TaskCardDate from "@/components/TaskCardDate";
import { formatDate } from "date-fns/format";
import { SocketContext } from "@/app/SocketProvider";
import type { TaskCardProps } from "./TaskCard.interfaces";
import type { Task } from "@repo/db";
import { formatUrl } from "@/utils/formatting";
import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import TaskContextMenu from "../TaskContextMenu";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useViewsStore,
	useWorkspaceStore,
} from "@/storeZ/provider";

const TaskCard = ({
	filteredTasks,
	setTaskData,
	highlightText,
	location,
}: TaskCardProps) => {
	const router = useRouter();
	const uniqueTasks: Task[] = [];

	const { showDateTime, showPriority, showLabels, view } =
		useViewsStore().getState();
	const { getAllTasks, deleteTask } = useTaskStore().getState();
	const { currentWorkspace } = useWorkspaceStore().getState();
	const { currentTeam } = useTeamStore().getState();

	const [deleteFade, setDeleteFade] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showDeleteCard, setShowDeleteCard] = useState(false);
	const [menuPosition, setMenuPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [isCopied, setIsCopied] = useState(false);

	const taskRefs = useRef<{ [key: string]: HTMLElement | null }>({});
	const socket = useContext(SocketContext);

	const handleDeleteTaskCard = async (task: Task) => {
		deleteTask(task.id);
		currentTeam && (await getAllTasks(currentTeam.id));
		setShowDeleteCard(false);
		setDeleteFade(false);

		socket.emit("remove_notification", task.id, socket.id);
	};

	const handleCloseDeleteCard = () => {
		setShowDeleteCard(false);
		setDeleteFade(false);
	};

	const handleContextMenu = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		task: Task,
	) => {
		e.preventDefault();
		setTaskData?.(task);
		setSelectedTask(task);
		setMenuPosition({ x: e.clientX, y: e.clientY });
	};

	const navigateToTask = (task: Task) => {
		router.push(
			`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`,
		);
	};

	const copyToClipboard = (taskId: string) => {
		navigator.clipboard.writeText(`${window.location.origin}/tasks/${taskId}`);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 3000);
	};

	const handleGlobalClick = () => {
		setMenuPosition(null);
	};

	useEffect(() => {
		// Fetching all users whenever the component mounts
		// You can remove this effect if the user list is managed elsewhere
	}, [currentWorkspace?.id]);

	useEffect(() => {
		function handleClickAway(e: MouseEvent) {
			if (
				!Object.values(taskRefs.current).some((taskEl) =>
					taskEl?.contains(e.target as Node),
				)
			) {
				setMenuPosition(null);
			}
		}

		document.addEventListener("mousedown", handleClickAway);
		return () => {
			document.removeEventListener("mousedown", handleClickAway);
		};
	}, []);

	const renderTaskCard = (task: Task, index: number) => (
		<Draggable draggableId={task.id} index={index} key={task.id}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					onClick={handleGlobalClick}
					onContextMenu={(e) => handleContextMenu(e, task)}
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
									copyToClipboard={copyToClipboard}
									setIsCopied={setIsCopied}
								/>
							</div>
							{view === "grid" ? (
								<Link
									href={`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`}
									onClick={() =>
										router.push(
											`/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(task.title)}`,
										)
									}
								>
									<div className="relative w-[325px]">
										<div
											key={task.id}
											className={
												"cursor-pointer flex flex-col justify-center w-full p-4 text-blue text-foreground rounded-lg shadow border dark:border-none hover:bg-accent space-y-4 bg-background"
											}
										>
											<TaskCardTitle
												task={task}
												taskTitle={task.title}
												location={location}
												highlightText={highlightText}
												isShown={showPriority}
											/>
											{showDateTime && (
												<TaskCardDate
													icon={<Calendar className="cursor-pointer size-4" />}
												>
													Due Date:{" "}
													{task.dueDate
														? formatDate(
																new Date(task.dueDate),
																"M/d/yy, h:mm a",
															)
														: "No Date Set"}
												</TaskCardDate>
											)}
											<div className="flex flex-row items-center space-x-4">
												{showPriority && (
													<TaskCardPriority border={true} task={task} />
												)}
												{showLabels && (
													<TaskCardLabels task={task} view="grid" />
												)}
											</div>
										</div>
									</div>
								</Link>
							) : (
								<div
									className={`relative group/main grid grid-cols-24 items-center w-full py-2 text-blue bg-card border-t border-solid border-border hover:bg-accent ${
										index === filteredTasks.length - 1 && "rounded-b-lg"
									}`}
								>
									<div className="group/select w-10 col-span-1 flex justify-end items-center pl-2 ml-3.5">
										<div className="hidden transition ease-in-out duration-200 sm:group-hover/main:hidden xs:group-hover/main:hidden md:group-hover/main:block md:group-hover/select:-translate-x-2">
											<GripVertical className="size-5" />
										</div>
										<div className="xs:mr-5 sm:mr-5 md:mr-4">
											<input
												title="input"
												className="appearance-none checked:bg-primary/80 form-checkbox border border-checkbox md:hidden rounded group-hover/select:block sm:block xs:block w-[13px] h-[13px]"
												type="checkbox"
											/>
										</div>
									</div>
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
