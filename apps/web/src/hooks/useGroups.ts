import {
	useTaskStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { CompletedTaskPeriod, TaskGroup } from "@/store/views";
import { Priority, Status, type Task } from "@squared/db";

export function useGroups(filterTasks: (tasks: Task[]) => Task[]) {
	const { tasks } = useTaskStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { displayOptions, view, getGridOptions, getListOptions } = useViewStore(
		(state) => state,
	);
	const { groupTasksBy, rowGrouping } = displayOptions;

	//all logic related to grouping by parent task is commented out until subtask rendering is fixed
	const getGroupTitles = (group: TaskGroup | null) => {
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
				const workspaceLabels = workspace?.Labels.map((l) => l.id) || [];
				groupTitles = [...workspaceLabels, "No labels"];
				break;
			}
			// case "Parent Issue":
			// 	groupTitles = tasks.map((task) => task.parentId || "No parent");
			// 	break;
			default:
				return [];
		}
		return Array.from(new Set(groupTitles));
	};

	const getTasksForGroup = (group: string) => {
		const taskFilter = filterTasks(tasks);
		switch (groupTasksBy) {
			case "Status":
				return taskFilter.filter((task) => task.status === group);
			case "Assignee":
				return taskFilter.filter((task) => task.assigneeId === group);
			case "Priority":
				return taskFilter.filter((task) => task.priority === group);
			case "Label":
				return taskFilter.filter((task) => task.labels.includes(group));
			// case "Parent Issue": {
			// 	const hasParentTask = taskFilter.filter(
			// 		(task) => task.parentId === group,
			// 	);
			// 	if (group !== "No parent") {
			// 		return hasParentTask;
			// 	}
			// 	return taskFilter.filter(
			// 		(task) => task.parentId === null && "No parent",
			// 	);
			// }
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
		const groupColumnTitles = getGroupTitles(groupTasksBy);

		let groupedColumns = groupColumnTitles
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

		if (groupTasksBy === "Assignee") {
			groupedColumns = groupedColumns.sort((a, b) => {
				if (a.group === "Unassigned") return 1;
				if (b.group === "Unassigned") return -1;

				const aUsername = users.find((u) => u.id === a.group)?.username ?? "";
				const bUsername = users.find((u) => u.id === b.group)?.username ?? "";

				// Compare by the first letter of the username
				return aUsername[0].localeCompare(bUsername[0]);
			});
		}
		return groupedColumns;
	};

	const getGroupedRows = () => {
		const groupRowTitles = getGroupTitles(rowGrouping);

		let groupedRows = groupRowTitles
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

		if (groupTasksBy === "Assignee") {
			groupedRows = groupedRows.sort((a, b) => {
				if (a.group === "Unassigned") return 1;
				if (b.group === "Unassigned") return -1;

				const aUsername = users.find((u) => u.id === a.group)?.username ?? "";
				const bUsername = users.find((u) => u.id === b.group)?.username ?? "";

				// Compare by the first letter of the username
				return aUsername[0].localeCompare(bUsername[0]);
			});
		}
		return groupedRows;
	};

	const getHiddenColumns = (): string[] => {
		const groupColumnTitles = getGroupTitles(groupTasksBy);
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
		getGroupedColumns,
		getGroupedRows,
		getHiddenColumns,
		getTasksForGroup,
	};
}
