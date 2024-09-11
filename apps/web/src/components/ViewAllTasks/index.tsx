"use client";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import StatusColumn from "@/components/StatusColumn";
import RenameModal from "@/components/RenameModal";
import { Status, type Task } from "@repo/db";
import type { ViewAllTasksProps } from "./ViewAllTasks.interfaces";
import { useViewsStore } from "@/storeZ";

const ViewAllTasks = ({
	handleDragEnd,
	activeSelected,
	backlogSelected,
	tasks,
}: ViewAllTasksProps) => {
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [taskData, setTaskData] = useState<Task | null>(null);

	const currentView = useViewsStore((state) => state.view);

	const titleArr: { value: Status; id: number }[] = [
		{ value: Status.backlog, id: 1 },
		{ value: Status.todo, id: 2 },
		{ value: Status.inProgress, id: 3 },
		{ value: Status.inReview, id: 4 },
		{ value: Status.done, id: 5 },
	];

	const getFilteredStatuses = () => {
		const allStatuses = titleArr.map((t) => t.value);
		if (activeSelected) {
			return allStatuses.filter(
				(status) => status === Status.todo || status === Status.inProgress,
			);
		}
		if (backlogSelected) {
			return allStatuses.filter((status) => status === Status.backlog);
		}
		return allStatuses;
	};

	const getTasksForStatus = (status: Status) => {
		return tasks.filter((task) => task.status === status);
	};

	const filteredColumns = () => {
		const filteredStatuses = getFilteredStatuses();
		return filteredStatuses.map((status) => {
			const tasksForStatus = getTasksForStatus(status);
			return (
				<div key={status}>
					<StatusColumn
						key={status}
						currentView={currentView}
						columnType={status}
						title={status}
						tasks={tasksForStatus}
						setShowRenameModal={setShowRenameModal}
						setTaskData={setTaskData}
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
