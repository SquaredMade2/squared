"use client";
import { Draggable } from "@hello-pangea/dnd";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useUserStore, useViewStore, useWorkspaceStore } from "@/store";
import TaskContextMenu from "./TaskContextMenu";
import TaskList from "./TaskList";
import TaskGrid from "./TaskGrid";
import type { TaskCardProps } from "./interfaces";

const TaskCard = ({ task, index, highlightText, location }: TaskCardProps) => {
	const { view } = useViewStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);

	const taskLabels =
		currentWorkspace?.Labels.filter((label) =>
			task.labels.includes(label.id),
		) || [];

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
							{view === "grid" && location !== "search" ? (
								<TaskGrid
									task={task}
									user={users.filter((u) => u.id === task.assigneeId)[0]}
									taskLabels={taskLabels}
									currentWorkspaceUrl={currentWorkspace?.url}
								/>
							) : (
								<TaskList
									task={task}
									user={users.filter((u) => u.id === task.assigneeId)[0]}
									location={location}
									highlightText={highlightText}
									currentWorkspaceUrl={currentWorkspace?.url}
									taskLabels={taskLabels}
								/>
							)}
						</ContextMenuTrigger>
					</ContextMenu>
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
