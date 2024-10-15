import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store";
import { Status, type Task } from "@repo/db";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";
import { parseParams } from "@/utils/parseParams";
import { type TaskGroup, useViewStore } from "@/store/views";

export function useTaskDashboard(filterTasks: (tasks: Task[]) => Task[]) {
	const { loading: teamLoading, currentTeam, authorized } = useTeams();
	const { loading: workspaceLoading, currentWorkspace } = useWorkspaces();
	const { tasks, updateTask, getAllTasks } = useTaskStore((state) => state);
	const { displayOptions } = useViewStore((state) => state);
	const [loading, setLoading] = useState(true);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);
	const { groupTasksBy } = displayOptions;

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

	const getTasksForStatus = (status: Status) => {
		return filterTasks(tasks).filter((task) => task.status === status);
	};

	const getTasksForGroup = (group: string) => {
		switch (groupTasksBy) {
			case "Status":
				return filterTasks(tasks).filter((task) => task.status === group);
			case "Assignee":
				return filterTasks(tasks).filter(
					(task) =>
						task.assigneeId === group ||
						(task.assigneeId === null && "Unassigned"),
				);
			case "Priority":
				return filterTasks(tasks).filter((task) => task.priority === group);
			case "Label":
				return filterTasks(tasks).filter((task) => task.labels.includes(group));
			case "Parent Issue": {
				const hasParentTask = filterTasks(tasks).filter(
					(task) => task.parentId === group,
				);
				if (group !== "No parent") {
					return hasParentTask;
				}
				return filterTasks(tasks).filter(
					(task) => task.parentId === null && "No parent",
				);
			}
			case "No grouping":
				return tasks;
			default:
				return tasks;
		}
	};

	const getGroupColumnTitles = (group: TaskGroup) => {
		let groupTitles: string[];
		switch (group) {
			case "Status":
				groupTitles = [
					Status.backlog,
					Status.todo,
					Status.inProgress,
					Status.inReview,
					Status.done,
				];
				break;
			case "Assignee":
				groupTitles = tasks.map((task) => task.assigneeId || "Unassigned");
				break;
			case "Priority":
				groupTitles = tasks.map((task) => task.priority);
				break;
			case "Label":
				groupTitles = tasks.flatMap((task) =>
					task.labels.length > 0 ? task.labels : ["No labels"],
				);
				break;
			case "Parent Issue":
				groupTitles = tasks.map((task) => task.parentId || "No parent");
				break;
			case "No grouping":
				return ["No grouping"];
			default:
				return [];
		}
		return Array.from(new Set(groupTitles));
	};

	return {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		getGroupColumnTitles,
		getTasksForGroup,
		handleDragEnd,
		getTasksForStatus,
	};
}
