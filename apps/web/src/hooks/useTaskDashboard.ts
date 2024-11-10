import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { TODO } from "@squared/context";
import type { Status } from "@squared/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskDashboard() {
	const { loading: teamLoading, currentTeam, authorized } = useTeams();
	const { loading: workspaceLoading, currentWorkspace } = useWorkspaces();
	const { tasks, setTasks, updateTask } = useTaskStore((state) => state);
	const [loading, setLoading] = useState(true);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);

	useEffect(() => {
		const initiateStore = async () => {
			if (teamLoading || workspaceLoading) return;
			setLoading(true);
			if (currentTeam) {
				setTasks(
					await taskService.getTeamTasks(TODO, { teamId: currentTeam.id }),
				);
			}
			setLoading(false);
		};

		initiateStore();
	}, [teamLoading, currentTeam, workspaceLoading]);

	const handleDragEnd: OnDragEndResponder = async ({
		destination,
		source,
		draggableId,
	}) => {
		if (!destination || destination.droppableId === source.droppableId) return;

		const draggedTask = tasks.find((task) => task.id === draggableId);
		if (!draggedTask) return;

		const updatedTask = {
			...draggedTask,
			status: destination.droppableId as Status,
		};
		await taskService.updateTask(TODO, {
			id: updatedTask.id,
			status: updatedTask.status,
		});
		updateTask(updatedTask);
	};

	return {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
	};
}
