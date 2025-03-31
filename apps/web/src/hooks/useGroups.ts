import type { GroupedColumn } from "@/components/ViewAllTasks/interfaces";
import {
	useTaskStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { CompletedTaskPeriod, TaskGroup } from "@/store/views";
import { Priority, Status, type Task } from "@squaredmade/db";
import { isAfter, startOfDay, subDays, subMonths } from "date-fns";

export function useGroups(filterTasks: (tasks: Task[]) => Task[]) {
	const { tasks } = useTaskStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { displayOptions, view, getGridOptions, getListOptions } = useViewStore(
		(state) => state,
	);
	const { groupTasksBy, groupRowsBy } = displayOptions;

	// Helper to get pre-defined sort order for statuses and priorities
	const getSortOrderIndex = (group: string, groupType: TaskGroup): number => {
		if (groupType === "Status") {
			const statusOrder = [
				Status.backlog,
				Status.todo,
				Status.inProgress,
				Status.inReview,
				Status.done,
				Status.canceled,
				Status.duplicated,
				Status.archived,
			];
			return statusOrder.indexOf(group as Status);
		}

		if (groupType === "Priority") {
			const priorityOrder = [
				Priority.urgent,
				Priority.high,
				Priority.medium,
				Priority.low,
				Priority.noPriority,
			];
			return priorityOrder.indexOf(group as Priority);
		}

		return -1;
	};

	//all logic related to grouping by parent task is commented out until subtask rendering is fixed
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
				const workspaceLabels = workspace?.labels.map((l) => l.name) || [];
				groupTitles = [...workspaceLabels, "No labels"];
				break;
			}
			// case "Parent Task":
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
				if (group === Status.done) {
					return taskFilter.filter(
						(task) =>
							task.status === Status.done ||
							task.status === Status.canceled ||
							task.status === Status.duplicated,
					);
				}
				return taskFilter.filter((task) => task.status === group);
			case "Assignee":
				return taskFilter.filter((task) => task.assigneeId === group);
			case "Priority":
				return taskFilter.filter((task) => task.priority === group);
			case "Label":
				return taskFilter.filter((task) =>
					task.labels.map((l) => l.name).includes(group),
				);
			// case "Parent Task": {
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

	// Helper function to check if a task belongs to a specific group type and value
	const belongsToGroup = (
		task: Task,
		groupValue: string,
		groupType: TaskGroup,
	): boolean => {
		switch (groupType) {
			case "Status":
				if (groupValue === Status.done) {
					return (
						task.status === Status.done ||
						task.status === Status.canceled ||
						task.status === Status.duplicated
					);
				}
				return task.status === groupValue;
			case "Assignee":
				return task.assigneeId === groupValue;
			case "Priority":
				return task.priority === groupValue;
			case "Label":
				return task.labels.map((l) => l.name).includes(groupValue);
			// case "Parent Task":
			// 	if (groupValue === "No parent") {
			// 		return task.parentId === null;
			// 	}
			// 	return task.parentId === groupValue;
			default:
				return false;
		}
	};

	const filterTasksByPeriod = (
		tasks: Task[],
		period: CompletedTaskPeriod,
	): Task[] => {
		const now = new Date();

		switch (period) {
			case "Past day": {
				const oneDayAgo = startOfDay(subDays(now, 1));
				return tasks.filter((task) =>
					isAfter(new Date(task.updatedAt), oneDayAgo),
				);
			}
			case "Past week": {
				const oneWeekAgo = subDays(now, 7);
				return tasks.filter((task) =>
					isAfter(new Date(task.updatedAt), oneWeekAgo),
				);
			}
			case "Past month": {
				const oneMonthAgo = subMonths(now, 1);
				return tasks.filter((task) =>
					isAfter(new Date(task.updatedAt), oneMonthAgo),
				);
			}
			case "None":
				return []; // If period is 'None', return no tasks
			default:
				return tasks; // Return all tasks for "All" or unrecognized period
		}
	};

	// Helper function to sort groups based on type
	const sortGroups = (
		groups: Omit<GroupedColumn, "showTasks">[],
		groupType: TaskGroup,
	) => {
		if (!groups || groups.length === 0) return [];

		return [...groups].sort((a, b) => {
			// Handle special cases first
			if (groupType === "Assignee") {
				if (a.group === "Unassigned") return 1;
				if (b.group === "Unassigned") return -1;

				const aUsername =
					users.find((u) => u.externalId === a.group)?.username ?? "";
				const bUsername =
					users.find((u) => u.externalId === b.group)?.username ?? "";

				// Compare by username alphabetically
				return aUsername.localeCompare(bUsername);
			}

			// Use predefined order for Status and Priority
			if (groupType === "Status" || groupType === "Priority") {
				const aIndex = getSortOrderIndex(a.group, groupType);
				const bIndex = getSortOrderIndex(b.group, groupType);

				// If both groups have a defined index, sort by that
				if (aIndex !== -1 && bIndex !== -1) {
					return aIndex - bIndex;
				}
			}

			// Default to alphabetical sort for other types like Label
			return a.group.localeCompare(b.group);
		});
	};

	const getGroupedColumns = () => {
		const groupColumnTitles = getGroupColumnTitles(groupTasksBy);

		let groupedColumns = groupColumnTitles
			.map((columnGroup) => {
				let tasksForColumn = getTasksForGroup(columnGroup);

				if (groupTasksBy === "Status") {
					if (columnGroup === Status.archived) return null;
					if (columnGroup === Status.done) {
						const { period, show } = displayOptions.showCompletedTasks;
						if (!show) return null;
						tasksForColumn = filterTasksByPeriod(tasksForColumn, period);
					}
				}

				const showEmptyGroups =
					view === "grid"
						? getGridOptions().showEmptyGroups
						: getListOptions().showEmptyGroups;

				if (tasksForColumn.length === 0 && !showEmptyGroups) return null;

				// If row grouping is enabled and not "None"
				if (groupRowsBy && groupRowsBy !== "None") {
					const rowGroupTitles = getGroupColumnTitles(groupRowsBy);
					let rowGroups = rowGroupTitles
						.map((rowGroup) => {
							// Get tasks that belong to both this column group and this row group
							const tasksForRowGroup = tasksForColumn.filter((task) =>
								belongsToGroup(task, rowGroup, groupRowsBy),
							);

							if (tasksForRowGroup.length === 0 && !showEmptyGroups) {
								return null;
							}

							return {
								group: rowGroup,
								tasks: tasksForRowGroup,
							};
						})
						.filter((group) => group !== null);

					// Sort row groups using the same logic as column groups
					if (rowGroups.length > 0) {
						rowGroups = sortGroups(rowGroups, groupRowsBy);
					}

					return {
						group: columnGroup,
						tasks: tasksForColumn, // Keep original tasks array for compatibility
						rowGroups,
					};
				}

				// No row grouping
				return {
					group: columnGroup,
					tasks: tasksForColumn,
				};
			})
			.filter((item) => item !== null);

		// Sort the columns according to their type
		groupedColumns = sortGroups(groupedColumns, groupTasksBy);

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
