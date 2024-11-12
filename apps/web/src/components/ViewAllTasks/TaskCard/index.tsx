"use client";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useUserStore, useViewStore, useWorkspaceStore } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@squared/db";
import TaskContextMenu from "./TaskContextMenu";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import type { TaskCardProps } from "./interfaces";

const TaskCard = ({ task, index, highlightText, location }: TaskCardProps) => {
	const { view } = useViewStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { users } = useUserStore((state) => state);

	const taskLabels =
		workspace?.Labels.filter((label) => task.labels.includes(label.id)) || [];

	const renderTask = (taskToRender: Task, isSubtask = false) => (
		<div className={`w-full ${isSubtask ? "mt-1" : ""}`}>
			{view === "grid" && location !== "search" ? (
				<TaskGrid
					task={taskToRender}
					user={users.filter((u) => u.id === task.assigneeId)[0]}
					taskLabels={taskLabels}
					currentWorkspaceUrl={workspace?.url}
				/>
			) : (
				<TaskList
					task={taskToRender}
					user={users.filter((u) => u.id === task.assigneeId)[0]}
					location={location}
					highlightText={highlightText}
					currentWorkspaceUrl={workspace?.url}
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
