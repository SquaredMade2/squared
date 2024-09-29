"use client";
import GroupColumn from "./GroupColumn";
import RenameModal from "@/components/RenameModal";
import { Status, type Task } from "@repo/db";
import type { ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";
import type { CompletedTaskPeriod } from "@/store/views";

const ViewAllTasks = ({
	getFilteredStatuses,
	getTasksForStatus,
}: ViewAllTasksProps) => {
	const { view, listViewOptions, gridViewOptions } = useViewStore(
		(state) => state,
	);
	const viewOptions = view === "list" ? listViewOptions : gridViewOptions;

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

	const filteredColumns = () => {
		const filteredStatuses = getFilteredStatuses();

		return filteredStatuses.map((status) => {
			if (status === Status.archived) return null;

			let tasksForStatus = getTasksForStatus(status);

			if (status === Status.done) {
				// If status is 'done', filter tasks based on updatedAt and period
				const { period, show } = viewOptions.showCompletedTasks;
				if (!show) return null; // Don't show completed tasks if the option is disabled
				tasksForStatus = filterTasksByPeriod(tasksForStatus, period);
			}

			if (tasksForStatus.length === 0 && !viewOptions.showEmptyGroups)
				// Don't display columns with no tasks unless 'showEmptyGroups' is enabled
				return null;

			return (
				<div key={status} className="px-1">
					<GroupColumn
						key={status}
						currentView={view}
						columnType={status}
						title={status}
						tasks={tasksForStatus}
					/>
				</div>
			);
		});
	};

	return (
		<>
			<RenameModal />
			<div className={view === "list" ? "block min-w-full" : "flex"}>
				{filteredColumns()}
			</div>
		</>
	);
};

export default ViewAllTasks;
