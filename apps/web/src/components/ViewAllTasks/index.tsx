"use client";
import { RenameModal } from "@/components/Modals";
import { useViewStore } from "@/store";
import { Status } from "@squared/db";
import { usePathname } from "next/navigation";
import { useState } from "react";
import GroupColumn from "./GroupColumn";
import TaskColumnTitle from "./TaskColumnTitle";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";

const ViewAllTasks = ({ getGroupedColumns }: ViewAllTasksProps) => {
	const { view, displayOptions } = useViewStore((state) => state);
	const [showTasks, setShowTasks] = useState(true);
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

	const isListView = view === "list";

	return (
		<>
			<RenameModal />
			<div className={isListView ? "block min-w-full" : "flex flex-col"}>
				<div className={isListView ? "flex flex-col" : "flex gap-2"}>
					{groupedColumns.map((column: GroupedColumn) => (
						<TaskColumnTitle
							title={column.group}
							showTasks={showTasks}
							setShowTasks={setShowTasks}
							numberOfTasks={column.tasks.length}
							isListView={isListView}
							key={column.group}
						/>
					))}
				</div>
				<div className={isListView ? "flex flex-col" : "flex gap-2"}>
					{groupedColumns.map((column: GroupedColumn) => (
						<GroupColumn
							key={column.group}
							group={column.group}
							tasks={column.tasks}
							currentView={view}
							showTasks={showTasks}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default ViewAllTasks;
