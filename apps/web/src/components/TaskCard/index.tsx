"use client";

import type React from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
	Ellipsis,
} from "lucide-react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
	useTeamStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { Status } from "@repo/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { high, medium, low, filterInProgress } from "@/components/Svg";
import TaskContextMenu from "../TaskContextMenu";
import TaskList from "./TaskList";
import TaskGrid from "./TaskGrid";
import type { TaskCardProps } from "./interfaces";

const TaskCard = ({ task, index, highlightText, location }: TaskCardProps) => {
	const { view } = useViewStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);

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
