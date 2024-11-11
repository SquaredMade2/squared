"use client";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useUserStore, useViewStore, useWorkspaceStore } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import type { Task, User } from "@squared/db";
import { useEffect, useState } from "react";
import TaskContextMenu from "./TaskContextMenu";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import type { TaskCardProps } from "./interfaces";

const TaskCard = ({ task, index, highlightText, location }: TaskCardProps) => {
	const [assignee, setAssignee] = useState<User | null>(null);
	const { view } = useViewStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);
	useEffect(() => {
		const foundUser = users.find((user) => user.id === task.assigneeId);
		setAssignee(foundUser ?? null);
	}, [task.assigneeId, users]);

	const taskLabels =
		currentWorkspace?.Labels.filter((label) =>
			task.labels.includes(label.id),
		) || [];

	const renderTask = (taskToRender: Task, isSubtask = false) => (
		<div className={`w-full ${isSubtask ? "mt-1" : ""}`}>
			{view === "grid" && location !== "search" ? (
				<TaskGrid
					task={taskToRender}
					user={assignee}
					taskLabels={taskLabels}
					currentWorkspaceUrl={currentWorkspace?.url}
				/>
			) : (
				<TaskList
					task={taskToRender}
					user={assignee}
					location={location}
					highlightText={highlightText}
					currentWorkspaceUrl={currentWorkspace?.url}
					taskLabels={taskLabels}
				/>
			)}
		</div>
	);

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
							<TaskContextMenu task={task} />
							{renderTask(task)}
						</ContextMenuTrigger>
					</ContextMenu>
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
