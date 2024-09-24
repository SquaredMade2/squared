"use client";
import { Draggable } from "@hello-pangea/dnd";
import {
	AlertTriangle,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CircleDot,
} from "lucide-react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
	useTeamStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import TaskContextMenu from "./TaskContextMenu";
import TaskList from "./TaskList";
import TaskGrid from "./TaskGrid";
import type { TaskCardProps } from "./interfaces";
import { getStatusIcon } from "@/utils/enumIcons";

const TaskCard = ({ task, index, highlightText, location }: TaskCardProps) => {
	const { view } = useViewStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);

	const getPriorityIcon = () => {
		switch (task.priority) {
			case "low":
				return <ArrowDown className="size-4 text-blue-500" />;
			case "medium":
				return <ArrowRight className="size-4 text-yellow-500" />;
			case "high":
				return <ArrowUp className="size-4 text-orange-500" />;
			case "urgent":
				return <AlertTriangle className="size-4 text-destructive" />;
			default:
				return <CircleDot className="size-4" />;
		}
	};

	const teamIdentifier =
		location === "dashboard" ? currentTeam?.identifier : task.teamId;

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
									teamIdentifier={teamIdentifier}
									priorityIcon={getPriorityIcon()}
									currentTeam={currentTeam}
									taskLabels={taskLabels}
								/>
							) : (
								<TaskList
									task={task}
									user={users.filter((u) => u.id === task.assigneeId)[0]}
									location={location}
									priorityIcon={getPriorityIcon()}
									statusIcon={getStatusIcon(task.status)}
									highlightText={highlightText}
									teamIdentifier={teamIdentifier}
									currentTeam={currentTeam}
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
