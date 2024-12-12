"use client";
import { RenameModal } from "@/components/Modals";
import { useViewStore } from "@/store";
import { Status } from "@squared/db";
import { usePathname } from "next/navigation";
import GroupColumn from "./GroupColumn";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";

const ViewAllTasks = ({ getGroupedColumns, sprintId }: ViewAllTasksProps) => {
	const { view, displayOptions } = useViewStore((state) => state);
	const { groupTasksBy } = displayOptions;
	const pathname = usePathname();

	const activeStatusGroups: Status[] = [
		Status.todo,
		Status.inProgress,
		Status.inReview,
	];

	const currentSprintStatusGroups: Status[] = [
		...activeStatusGroups,
		Status.done,
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
		} else if (pathname.includes("/sprints/current")) {
			groupedColumns = groupedColumns.filter((column) =>
				currentSprintStatusGroups.includes(column.group as Status),
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
						sprintId={sprintId}
					/>
				))}
			</div>
		</>
	);
};

export default ViewAllTasks;
