"use client";
import GroupColumn from "./GroupColumn";
import { RenameModal } from "@/components/Modals";
import { Status, type Task } from "@repo/db";
import type { ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";
import type { CompletedTaskPeriod } from "@/store/views";
// import { statusOptions } from "@/constants/designations";

const ViewAllTasks = ({
	// getTasksForStatus,
	getGroupColumnTitles,
	getTasksForGroup,
	// allowedColumns = Object.values(Status),
	sprintId,
}: ViewAllTasksProps) => {
	const { view, displayOptions, getGridOptions, getListOptions } = useViewStore(
		(state) => state,
	);
	const { groupTasksBy } = displayOptions;

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

	// Compute columns before the return statement
	const columns = getGroupedColumns();

	function getGroupedColumns() {
		const groupColumnTitles = getGroupColumnTitles(groupTasksBy);
		return groupColumnTitles.map((group) => {
			let tasksForGroup = getTasksForGroup(group);
			if (groupTasksBy === "Status") {
				if (group === Status.archived) return null;
				if (group === Status.done) {
					const { period, show } = displayOptions.showCompletedTasks;
					if (!show) return null;
					tasksForGroup = filterTasksByPeriod(tasksForGroup, period);
				}
				if (
					tasksForGroup.length === 0 &&
					!(view === "grid" ? getGridOptions() : getListOptions())
						.showEmptyGroups
				)
					return null;
			}
			// console.log(tasksForGroup, group);
			return (
				<div key={group}>
					<GroupColumn
						group={group}
						tasks={tasksForGroup}
						currentView={view}
						sprintId={sprintId}
					/>
				</div>
			);
		});
	}
	// console.log(getGroupedColumns(), groupTasksBy);

	// function filteredColumns() {
	// 	const filteredStatuses = statusOptions;
	// 	return filteredStatuses
	// 		.filter((status) => allowedColumns.includes(status))
	// 		.map((status) => {
	// 			if (status === Status.archived) return null;

	// 			let tasksForStatus = getTasksForStatus(status);

	// 			if (status === Status.done) {
	// 				// If status is 'done', filter tasks based on updatedAt and period
	// 				const { period, show } = displayOptions.showCompletedTasks;
	// 				if (!show) return null; // Don't show completed tasks if the option is disabled
	// 				tasksForStatus = filterTasksByPeriod(tasksForStatus, period);
	// 			}
	// 			if (
	// 				tasksForStatus.length === 0 &&
	// 				!(view === "grid" ? getGridOptions() : getListOptions())
	// 					.showEmptyGroups
	// 			)
	// 				// Don't display columns with no tasks unless 'showEmptyGroups' is enabled
	// 				return null;

	// 			return (
	// 				<div key={status} className="px-1">
	// 					<GroupColumn
	// 						key={status}
	// 						currentView={view}
	// 						columnType={status}
	// 						title={status}
	// 						tasks={tasksForStatus.filter((t) => t.parentId === null)}
	// 						sprintId={sprintId}
	// 					/>
	// 				</div>
	// 			);
	// 		});
	// }

	return (
		<>
			<RenameModal />
			<div className={view === "list" ? "block min-w-full" : "flex"}>
				{columns}
			</div>
		</>
	);
};

export default ViewAllTasks;
