"use client";
import GroupColumn from "./GroupColumn";
import RenameModal from "@/components/RenameModal";
import { Status } from "@repo/db";
import type { ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";

const ViewAllTasks = ({
	getFilteredStatuses,
	getTasksForStatus,
}: ViewAllTasksProps) => {
	const { view, listViewOptions, gridViewOptions } = useViewStore(
		(state) => state,
	);
	const viewOptions = view === "list" ? listViewOptions : gridViewOptions;

	const filteredColumns = () => {
		const filteredStatuses = getFilteredStatuses();
		return filteredStatuses.map((status) => {
			if (status === Status.archived) return null;
			if (status === Status.done && !viewOptions.showCompletedTasks.show)
				return null;
			const tasksForStatus = getTasksForStatus(status);
			if (tasksForStatus.length === 0 && !viewOptions.showEmptyGroups)
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
