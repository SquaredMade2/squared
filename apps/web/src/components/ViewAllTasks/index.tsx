"use client";
import GroupColumn from "./GroupColumn";
import { RenameModal } from "@/components/Modals";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";

const ViewAllTasks = ({ getGroupedColumns }: ViewAllTasksProps) => {
	const { view } = useViewStore((state) => state);

	// Compute columns before the return statement
	const groupedColumns = getGroupedColumns();

	return (
		<>
			<RenameModal />
			<div className={view === "list" ? "block min-w-full" : "flex"}>
				{groupedColumns.map((column: GroupedColumn) => (
					<GroupColumn
						key={column.group}
						group={column.group}
						tasks={column.tasks}
						currentView={view}
					/>
				))}
			</div>
		</>
	);
};

export default ViewAllTasks;
