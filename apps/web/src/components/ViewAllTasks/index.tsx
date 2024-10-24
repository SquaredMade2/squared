"use client";
import GroupColumn from "./GroupColumn";
import { RenameModal } from "@/components/Modals";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";
import { usePathname } from "next/navigation";
import { Status } from "@repo/db";

const ViewAllTasks = ({ getGroupedColumns }: ViewAllTasksProps) => {
	const { view, displayOptions } = useViewStore((state) => state);
	const { groupTasksBy } = displayOptions;
	const pathname = usePathname();

	const activeStatusGroups: Status[] = [
		Status.todo,
		Status.inProgress,
		Status.inReview,
	];

	let groupedColumns = getGroupedColumns();

	if (groupTasksBy === "Status") {
		if (pathname.includes("/active")) {
			groupedColumns = groupedColumns.filter((column) =>
				activeStatusGroups.includes(column.group as Status),
			);
		} else if (pathname.includes("/backlog")) {
			groupedColumns = groupedColumns.filter(
				(column) => column.group === Status.backlog,
			);
		}
	}

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
