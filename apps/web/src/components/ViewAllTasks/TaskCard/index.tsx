"use client";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useUserStore, useViewStore, useWorkspaceStore } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import type { DraggableProvided } from "@hello-pangea/dnd";
import type { Task, User } from "@squared/db";
import { useEffect, useState } from "react";
import TaskContextMenu from "./TaskContextMenu";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import type { TaskCardProps } from "./interfaces";

const TaskCard = ({
	task,
	index,
	highlightText,
	location,
	isDisabled,
}: TaskCardProps) => {
	const [assignee, setAssignee] = useState<User | null>(null);
	const { view } = useViewStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { users } = useUserStore((state) => state);
	useEffect(() => {
		const foundUser = users.find((user) => user.externalId === task.assigneeId);
		setAssignee(foundUser ?? null);
	}, [task.assigneeId, users]);

	const taskLabels =
		workspace?.Labels.filter((label) => task.labels.includes(label.id)) || [];

	const renderTask = (taskToRender: Task, isSubtask = false) => (
		<div className={`w-full ${isSubtask ? "mt-1" : ""}`}>
			{view === "grid" && location !== "search" ? (
				<TaskGrid
					isDisabled={!!isDisabled}
					task={taskToRender}
					user={assignee}
					taskLabels={taskLabels}
					currentWorkspaceUrl={workspace?.url}
				/>
			) : (
				<TaskList
					task={taskToRender}
					user={assignee}
					location={location}
					highlightText={highlightText}
					currentWorkspaceUrl={workspace?.url}
					taskLabels={taskLabels}
				/>
			)}
		</div>
	);

	return (
		<Draggable
			draggableId={task.id}
			index={index}
			isDragDisabled={!!isDisabled}
		>
			{(dragProvided: DraggableProvided) => (
				<div
					ref={(ref) => dragProvided.innerRef(ref)}
					{...dragProvided.draggableProps}
					{...dragProvided.dragHandleProps}
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
