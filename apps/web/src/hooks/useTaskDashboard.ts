import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store";
import { Priority, Status, type Task } from "@repo/db";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";
import { parseParams } from "@/utils/parseParams";
import { type TaskGroup, useViewStore } from "@/store/views";
import { useUsers } from "./useUsers";
import { formatPriority, formatStatus } from "@/utils/formatting";

export function useTaskDashboard(filterTasks: (tasks: Task[]) => Task[]) {
	const { loading: teamLoading, currentTeam, authorized } = useTeams();
	const { loading: workspaceLoading, currentWorkspace } = useWorkspaces();
	const { users } = useUsers();
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
			case "Assignee": {
				const assigneeIds = users.map((u) => u.id);
				groupTitles = [...assigneeIds, "No Assignee"];
				break;
			}
			case "Priority":
				groupTitles = [
					Priority.noPriority,
					Priority.low,
					Priority.medium,
					Priority.high,
					Priority.urgent,
				];
				break;
			case "Label": {
				const workspaceLabels = currentWorkspace?.Labels.map((l) => l.id) || [];
				groupTitles = [...workspaceLabels, "No labels"];
				break;
			}
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

	const formatColumnTitle = (title: string) => {
		switch (groupTasksBy) {
			case "Status":
				return formatStatus(title as Status);
			case "Assignee": {
				const user = users.find((user) => user.id === title);
				return user ? user.name : "Unassigned";
			}
			case "Priority":
				return formatPriority(title as Priority);
			case "Label": {
				const labelName = currentWorkspace?.Labels.find(
					(label) => label.id === title,
				);
				return labelName ? labelName.name : "No label";
			}
			case "Parent Issue": {
				const parentTask = tasks.find((t) => t.id === title);
				return parentTask ? parentTask.title : "No parent";
			}
			case "No grouping":
				return title;
		}
	};

	const getHiddenColumns = (): string[] => {
		const groupColumnTitles = getGroupColumnTitles(groupTasksBy);
		return groupColumnTitles.filter((group) => {
			const tasks = getTasksForGroup(group);
			if (displayOptions.groupTasksBy === "Status") {
				if (group === Status.archived) return false;
				if (group === Status.done && !displayOptions.showCompletedTasks.show) {
					return tasks;
				}
			}
			return tasks && tasks.length === 0;
		});
	};

	return {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		getTasksForStatus,
		getGroupColumnTitles,
		getTasksForGroup,
		formatColumnTitle,
		getHiddenColumns,
		handleDragEnd,
	};
}
