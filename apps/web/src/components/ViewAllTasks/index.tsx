"use client";
import GroupColumn from "./GroupColumn";
import { RenameModal } from "@/components/Modals";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";
import { useViewStore } from "@/store";
import { usePathname } from "next/navigation";
import { Status } from "@squared/db";

const ViewAllTasks = ({ getGroupedColumns }: ViewAllTasksProps) => {
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
					/>
				))}
			</div>
		</>
	);
};

export default ViewAllTasks;
