"use client";
import { DragDropContext } from "@hello-pangea/dnd";
import StatusColumn from "@/components/StatusColumn";
import RenameModal from "@/components/RenameModal";
import { Status } from "@repo/db";
import type { ViewAllTasksProps } from "./ViewAllTasks.interfaces";
import { useViewStore } from "@/store";

const ViewAllTasks = ({ handleDragEnd, tasks }: ViewAllTasksProps) => {
	const currentView = useViewStore((state) => state.view);

	const titleArr: { value: Status; id: number }[] = [
		{ value: Status.backlog, id: 1 },
		{ value: Status.todo, id: 2 },
		{ value: Status.inProgress, id: 3 },
		{ value: Status.inReview, id: 4 },
		{ value: Status.done, id: 5 },
	];

	const getFilteredStatuses = () => {
		return titleArr.map((t) => t.value);
		// if (activeSelected) {									// will uncomment/delete logic in next pr - kaila
		// 	return allStatuses.filter(
		// 		(status) => status === Status.todo || status === Status.inProgress,
		// 	);
		// }
		// if (backlogSelected) {
		// 	return allStatuses.filter((status) => status === Status.backlog);
		// }
	};

	const getTasksForStatus = (status: Status) => {
		return tasks.filter((task) => task.status === status);
	};

	const filteredColumns = () => {
		const filteredStatuses = getFilteredStatuses();
		return filteredStatuses.map((status) => {
			if (status === Status.archived) return null;
			const tasksForStatus = getTasksForStatus(status);
			if (tasksForStatus.length === 0) return null;
			return (
				<div key={status} className="px-1">
					<StatusColumn
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
				<div className={currentView === "list" ? "block" : "flex"}>
					{filteredColumns()}
				</div>
			</DragDropContext>
		</>
	);
};

export default ViewAllTasks;
