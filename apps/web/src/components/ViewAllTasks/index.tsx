import { Status } from "@squaredmade/db";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFilterStore, useViewStore } from "@/store";
import { RenameModal } from "../Modals";
import GroupColumn from "./GroupColumn";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";
import { RowGroupingWrapper } from "./RowGroupingWrapper";
import TaskColumnTitle from "./TaskColumnTitle";

const ViewAllTasks = ({ getGroupedColumns }: ViewAllTasksProps) => {
	const { view, displayOptions } = useViewStore((state) => state);
	// Track visible columns with a Map to handle individual column visibility
	const [visibleColumns, setVisibleColumns] = useState<Map<string, boolean>>(
		new Map(),
	);

	// Default visibility is true if not explicitly set
	const getColumnVisibility = (columnGroup: string): boolean => {
		return visibleColumns.has(columnGroup)
			? // biome-ignore lint/style/noNonNullAssertion: We just checked that this key exists
				visibleColumns.get(columnGroup)!
			: true;
	};

	// Toggle visibility for a specific column
	const toggleColumnVisibility = (columnGroup: string, isVisible?: boolean) => {
		setVisibleColumns((prev) => {
			const newMap = new Map(prev);
			newMap.set(
				columnGroup,
				isVisible !== undefined ? isVisible : !getColumnVisibility(columnGroup),
			);
			return newMap;
		});
	};
	const { filterSearchTasks } = useFilterStore((state) => state);
	const { groupTasksBy, groupRowsBy } = displayOptions;
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

	if (groupTasksBy === "status") {
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
			let filteredTasks = filterSearchTasks(column.tasks);
			if (!displayOptions.showSubTasks) {
				filteredTasks = filteredTasks.filter((task) => !task.parentId);
			}

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
					rowGroups: filteredRowGroups,
					showTasks: getColumnVisibility(column.group),
					tasks: filteredTasks,
				};
			}

			return {
				...column,
				showTasks: getColumnVisibility(column.group),
				tasks: filteredTasks,
			};
		})
		.filter((column) => {
			return displayOptions.viewOptions[`${view}Options`].showEmptyGroups
				? true
				: column.tasks.length > 0;
		});

	return (
		<>
			<RenameModal />
			<div className={isListView ? "block min-w-full" : "flex flex-col"}>
				{groupRowsBy !== "None" ? (
					<RowGroupingWrapper
						groupedColumns={groupedColumns}
						isListView={isListView}
						visibleColumns={visibleColumns}
					/>
				) : (
					<div className={isListView ? "flex flex-col" : "flex gap-2"}>
						{groupedColumns.map((column: GroupedColumn) => (
							<div className={isListView ? "contents" : ""} key={column.group}>
								<TaskColumnTitle
									isListView={isListView}
									numberOfTasks={column.tasks.length}
									setShowTasks={(visible) =>
										toggleColumnVisibility(column.group, visible)
									}
									showTasks={getColumnVisibility(column.group)}
									title={column.group}
								/>
								<GroupColumn
									currentView={view}
									group={column.group}
									key={column.group}
									rowGroups={column.rowGroups}
									showTasks={getColumnVisibility(column.group)}
									tasks={column.tasks}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default ViewAllTasks;
