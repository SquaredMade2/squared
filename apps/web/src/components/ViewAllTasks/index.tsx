"use client";
import { DragDropContext } from "@hello-pangea/dnd";
import GroupColumn from "./GroupColumn";
import RenameModal from "@/components/RenameModal";
import { Status } from "@repo/db";
import type { ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";
import UnassignedColumns from "./UnassignedColumns";
import { usePathname } from "next/navigation";

const ViewAllTasks = ({ handleDragEnd, tasks }: ViewAllTasksProps) => {
	const currentView = useViewStore((state) => state.view);
	const currentRoute = usePathname();
	const allRoute = currentRoute.includes("/all");

	const titleArr: { value: Status; id: number }[] = [
		{ value: Status.backlog, id: 1 },
		{ value: Status.todo, id: 2 },
		{ value: Status.inProgress, id: 3 },
		{ value: Status.inReview, id: 4 },
		{ value: Status.done, id: 5 },
	];

	const getFilteredStatuses = () => {
		return titleArr.map((t) => t.value);
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

	const getEmptyColumns = (): Status[] => {
		const filteredStatuses = getFilteredStatuses();

		return filteredStatuses.filter((status) => {
			if (status === Status.archived) return false;

			const tasks = getTasksForStatus(status);
			return tasks && tasks.length === 0;
		});
	};

	return (
		<>
			<RenameModal />
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className={currentView === "list" ? "block" : "flex min-w-full"}>
					{filteredColumns()}
					{allRoute &&
						currentView === "grid" &&
						getEmptyColumns().length >= 1 && (
							<div className="ml-auto">
								<UnassignedColumns getEmptyColumns={getEmptyColumns} />
							</div>
						)}
				</div>
			</DragDropContext>
		</>
	);
};

export default ViewAllTasks;
