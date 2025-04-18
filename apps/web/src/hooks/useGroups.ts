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
import { useCallback, useMemo } from "react";

export function useGroups(filterTasks: (tasks: Task[]) => Task[]) {
	const { tasks } = useTaskStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { displayOptions, view, getGridOptions, getListOptions } = useViewStore(
		(state) => state,
	);
	const { groupTasksBy, groupRowsBy } = displayOptions;

	// Memoize the filtered tasks to avoid recalculating on every render
	const filteredTasks = useMemo(() => filterTasks(tasks), [filterTasks, tasks]);

	// Helper to get pre-defined sort order for statuses and priorities
	const getSortOrderIndex = useCallback(
		(group: string, groupType: TaskGroup): number => {
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
		},
		[],
	);

	// Memoize column titles to avoid recalculation
	const getGroupColumnTitles = useCallback(
		(group: TaskGroup) => {
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
				default:
					return [];
			}
			return Array.from(new Set(groupTitles));
		},
		[tasks, workspace],
	);

	// Memoize groups for each column/group type
	const getTasksForGroup = useCallback(
		(group: string) => {
			switch (groupTasksBy) {
				case "Status":
					if (group === Status.done) {
						return filteredTasks.filter(
							(task) =>
								task.status === Status.done ||
								task.status === Status.canceled ||
								task.status === Status.duplicated,
						);
					}
					return filteredTasks.filter((task) => task.status === group);
				case "Assignee":
					return filteredTasks.filter((task) => task.assigneeId === group);
				case "Priority":
					return filteredTasks.filter((task) => task.priority === group);
				case "Label":
					return filteredTasks.filter((task) =>
						task.labels.map((l) => l.name).includes(group),
					);
				default:
					return tasks;
			}
		},
		[filteredTasks, groupTasksBy, tasks],
	);

	// Helper function to check if a task belongs to a specific group type and value
	const belongsToGroup = useCallback(
		(task: Task, groupValue: string, groupType: TaskGroup): boolean => {
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
				default:
					return false;
			}
		},
		[],
	);

	// Memoize period filtering logic
	const filterTasksByPeriod = useCallback(
		(tasksToFilter: Task[], period: CompletedTaskPeriod): Task[] => {
			const now = new Date();

			switch (period) {
				case "Past day": {
					const oneDayAgo = startOfDay(subDays(now, 1));
					return tasksToFilter.filter((task) =>
						isAfter(new Date(task.updatedAt), oneDayAgo),
					);
				}
				case "Past week": {
					const oneWeekAgo = subDays(now, 7);
					return tasksToFilter.filter((task) =>
						isAfter(new Date(task.updatedAt), oneWeekAgo),
					);
				}
				case "Past month": {
					const oneMonthAgo = subMonths(now, 1);
					return tasksToFilter.filter((task) =>
						isAfter(new Date(task.updatedAt), oneMonthAgo),
					);
				}
				case "None":
					return []; // If period is 'None', return no tasks
				default:
					return tasksToFilter; // Return all tasks for "All" or unrecognized period
			}
		},
		[],
	);

	// Helper function to sort groups based on type
	const sortGroups = useCallback(
		(groups: Omit<GroupedColumn, "showTasks">[], groupType: TaskGroup) => {
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
		},
		[getSortOrderIndex, users],
	);

	// Memoize the expensive computation of grouped columns
	const getGroupedColumns = useCallback(() => {
		const groupColumnTitles = getGroupColumnTitles(groupTasksBy);
		const showEmptyGroups =
			view === "grid"
				? getGridOptions().showEmptyGroups
				: getListOptions().showEmptyGroups;

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
						.filter((g) => g !== null);

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
			.filter((g) => g !== null);

		// Sort the columns according to their type
		groupedColumns = sortGroups(groupedColumns, groupTasksBy);

		return groupedColumns;
	}, [
		groupTasksBy,
		getGroupColumnTitles,
		getTasksForGroup,
		view,
		getGridOptions,
		getListOptions,
		displayOptions.showCompletedTasks,
		filterTasksByPeriod,
		groupRowsBy,
		belongsToGroup,
		sortGroups,
	]);

	// Memoize the computation of hidden columns
	const getHiddenColumns = useCallback((): string[] => {
		const groupColumnTitles = getGroupColumnTitles(groupTasksBy);
		return groupColumnTitles.filter((group) => {
			const tasks = getTasksForGroup(group);
			if (displayOptions.groupTasksBy === "Status") {
				if (group === Status.archived) return false;
				if (group === Status.done && !displayOptions.showCompletedTasks.show) {
					return tasks.length > 0;
				}
			}
			return tasks && tasks.length === 0;
		});
	}, [
		getGroupColumnTitles,
		groupTasksBy,
		getTasksForGroup,
		displayOptions.groupTasksBy,
		displayOptions.showCompletedTasks.show,
	]);

	// Memoize the final return values
	return useMemo(
		() => ({
			getGroupedColumns,
			getHiddenColumns,
			getTasksForGroup,
		}),
		[getGroupedColumns, getHiddenColumns, getTasksForGroup],
	);
}
