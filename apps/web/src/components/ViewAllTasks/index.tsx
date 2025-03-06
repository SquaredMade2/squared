import { useFilterStore, useViewStore } from "@/store";
import { Status } from "@squared/db";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RenameModal } from "../Modals";
import GroupColumn from "./GroupColumn";
import TaskColumnTitle from "./TaskColumnTitle";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";

const ViewAllTasks = ({ getGroupedColumns }: ViewAllTasksProps) => {
	const { view, displayOptions } = useViewStore((state) => state);
	const [showTasks, setShowTasks] = useState(true);
	const { filterSearchTasks } = useFilterStore((state) => state);
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

	// Apply search filtering to tasks and rowGroups if present
	groupedColumns = groupedColumns
		.map((column) => {
			const filteredTasks = filterSearchTasks(column.tasks);

			// If we have row groups, filter those as well
			if (column.rowGroups) {
				const filteredRowGroups = column.rowGroups
					.map((rowGroup) => ({
						...rowGroup,
						tasks: filterSearchTasks(rowGroup.tasks),
					}))
					.filter((rowGroup) => rowGroup.tasks.length > 0);

				return {
					...column,
					tasks: filteredTasks,
					rowGroups: filteredRowGroups,
				};
			}

			return {
				...column,
				tasks: filteredTasks,
			};
		})
		.filter((column) => column.tasks.length > 0);

	return (
		<>
			<RenameModal />
			<div className={isListView ? "block min-w-full" : "flex flex-col"}>
				<div className={isListView ? "flex flex-col" : "flex gap-2"}>
					{groupedColumns.map((column: GroupedColumn) => (
						<div key={column.group} className={isListView ? "contents" : ""}>
							<TaskColumnTitle
								title={column.group}
								showTasks={showTasks}
								setShowTasks={setShowTasks}
								numberOfTasks={column.tasks.length}
								isListView={isListView}
							/>
							<GroupColumn
								key={column.group}
								group={column.group}
								tasks={column.tasks}
								rowGroups={column.rowGroups}
								currentView={view}
								showTasks={showTasks}
							/>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default ViewAllTasks;
