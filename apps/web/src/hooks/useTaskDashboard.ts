import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store";
import { Status, type Task } from "@repo/db";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";
import { parseParams } from "@/utils/parseParams";

export function useTaskDashboard(filterTasks: (tasks: Task[]) => Task[]) {
	const { loading: teamLoading, currentTeam, authorized } = useTeams();
	const { loading: workspaceLoading, currentWorkspace } = useWorkspaces();
	const { tasks, updateTask, getAllTasks } = useTaskStore((state) => state);
	const [loading, setLoading] = useState(true);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);

	useEffect(() => {
		const initiateStore = async () => {
			if (teamLoading || workspaceLoading) return;
			setLoading(true);
			if (currentTeam) {
				await getAllTasks(currentTeam.id);
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
		await updateTask(updatedTask.id, { status: updatedTask.status });
	};

	const titleArr: { value: Status; id: number }[] = [
		{ value: Status.backlog, id: 1 },
		{ value: Status.todo, id: 2 },
		{ value: Status.inProgress, id: 3 },
		{ value: Status.inReview, id: 4 },
		{ value: Status.done, id: 5 },
	];

	const getFilteredStatuses = () => {
		return titleArr.map((t) => t.value);
	};

	const getTasksForStatus = (status: Status) => {
		return filterTasks(tasks).filter((task) => task.status === status);
	};

	return {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	};
}
