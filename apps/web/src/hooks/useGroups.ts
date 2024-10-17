import { useTaskStore, useViewStore, useWorkspaceStore } from "@/store";
import type { CompletedTaskPeriod, TaskGroup } from "@/store/views";
import { Priority, Status, type Task } from "@repo/db";

export function useGroups(filterTasks: (tasks: Task[]) => Task[]) {
	const { tasks } = useTaskStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { displayOptions, view, getGridOptions, getListOptions } = useViewStore(
		(state) => state,
	);
	const { groupTasksBy } = displayOptions;

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
				const assigneeIds = tasks.map((t) => t.assigneeId || "Unassigned");
				groupTitles = [...assigneeIds];
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

	const getTasksForGroup = (group: string) => {
		switch (groupTasksBy) {
			case "Status":
				return filterTasks(tasks).filter((task) => task.status === group);
			case "Assignee":
				return filterTasks(tasks).filter((task) => task.assigneeId === group);
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

	const filterTasksByPeriod = (tasks: Task[], period: CompletedTaskPeriod) => {
		const now = new Date();
		switch (period) {
			case "Past day":
				return tasks.filter(
					(task) =>
						new Date(task.updatedAt) >=
						new Date(now.setDate(now.getDate() - 1)),
				);
			case "Past week":
				return tasks.filter(
					(task) =>
						new Date(task.updatedAt) >=
						new Date(now.setDate(now.getDate() - 7)),
				);
			case "Past month":
				return tasks.filter(
					(task) =>
						new Date(task.updatedAt) >=
						new Date(now.setMonth(now.getMonth() - 1)),
				);
			case "None":
				return []; // If period is 'None', return no tasks
			default:
				return tasks; // Return all tasks for "All" or unrecognized period
		}
	};

	const getGroupedColumns = () => {
		const groupColumnTitles = getGroupColumnTitles(groupTasksBy);

		const groupedColumns = groupColumnTitles
			.map((group) => {
				let tasksForGroup = getTasksForGroup(group);

				if (groupTasksBy === "Status") {
					if (group === Status.archived) return null;
					if (group === Status.done) {
						const { period, show } = displayOptions.showCompletedTasks;
						if (!show) return null;
						tasksForGroup = filterTasksByPeriod(tasksForGroup, period);
					}
				}

				const showEmptyGroups =
					view === "grid"
						? getGridOptions().showEmptyGroups
						: getListOptions().showEmptyGroups;
				if (tasksForGroup.length === 0 && !showEmptyGroups) return null;

				return { group, tasks: tasksForGroup };
			})
			.filter((item) => item !== null); // Filter out null values

		return groupedColumns;
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

	return { getGroupedColumns, getHiddenColumns, getTasksForGroup };
}
