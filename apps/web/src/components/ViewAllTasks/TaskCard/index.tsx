"use client";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useUsers } from "@/hooks/useUsers";
import { useViewStore, useWorkspaceStore } from "@/store";
import type { DraggableProvided } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@squared/db";
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
	const { view } = useViewStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { users } = useUsers();
	const assignee = users?.find((user) => user.userId === task.assigneeId);

	const taskLabels =
		workspace?.labels.filter((label) =>
			task.labels.map((l) => l.name).includes(label.name),
		) || [];

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
					ref={(ref) => {
						dragProvided.innerRef(ref);
					}}
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
