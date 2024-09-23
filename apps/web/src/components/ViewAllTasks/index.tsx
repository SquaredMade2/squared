"use client";
import GroupColumn from "./GroupColumn";
import RenameModal from "@/components/RenameModal";
import { Status } from "@repo/db";
import type { ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";
import { DragDropContext } from "@hello-pangea/dnd";

const ViewAllTasks = ({
	handleDragEnd,
	getFilteredStatuses,
	getTasksForStatus,
}: ViewAllTasksProps) => {
	const currentView = useViewStore((state) => state.view);

	const filteredColumns = () => {
		const filteredStatuses = getFilteredStatuses();
		return filteredStatuses.map((status) => {
			if (status === Status.archived) return null;
			const tasksForStatus = getTasksForStatus(status);
			if (tasksForStatus.length === 0) return null;
			return (
				<div key={status} className="px-1">
					<GroupColumn
						key={status}
						currentView={currentView}
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
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className={currentView === "list" ? "block min-w-full" : "flex"}>
					{filteredColumns()}
				</div>
			</DragDropContext>
		</>
	);
};

export default ViewAllTasks;
