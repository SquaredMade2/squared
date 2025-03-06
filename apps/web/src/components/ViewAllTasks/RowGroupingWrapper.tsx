import { useViewStore } from "@/store";
import { cn } from "@/utils/cn";
import { ChevronDown, ChevronRight } from "@squared/icons";
import { useState } from "react";
import { Button } from "../ui/button";
import GroupColumn from "./GroupColumn";
import { RowGroupHeader } from "./RowGroupHeader";
import TaskColumnTitle from "./TaskColumnTitle";
import type { GroupedColumn } from "./interfaces";

/**
 * A component that handles row-based task grouping across multiple columns
 */
export const RowGroupingWrapper = ({
	groupedColumns,
	isListView,
}: {
	groupedColumns: GroupedColumn[];
	isListView: boolean;
}) => {
	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy } = displayOptions;

	// This component is only used when groupRowsBy !== "None"
	if (groupRowsBy === "None") {
		return null;
	}

	// Get all unique row groups across all columns
	const allRowGroups = new Set<string>();
	for (const column of groupedColumns) {
		for (const rowGroup of column.rowGroups ?? []) {
			allRowGroups.add(rowGroup.group);
		}
	}

	const uniqueRowGroups = Array.from(allRowGroups).sort();

	return (
		<div className="w-full">
			{uniqueRowGroups.map((rowGroup) => (
				<RowGroup
					key={rowGroup}
					rowGroup={rowGroup}
					groupedColumns={groupedColumns}
					isListView={isListView}
				/>
			))}
		</div>
	);
};

/**
 * A component that renders a single row group spanning all columns
 */
const RowGroup = ({
	rowGroup,
	groupedColumns,
	isListView,
}: {
	rowGroup: string;
	groupedColumns: GroupedColumn[];
	isListView: boolean;
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy } = displayOptions;

	// Calculate total tasks in this row group across all columns
	let totalTasksInRow = 0;
	for (const column of groupedColumns) {
		const matchingRowGroup = column.rowGroups?.find(
			(group) => group.group === rowGroup,
		);
		if (matchingRowGroup) {
			totalTasksInRow += matchingRowGroup.tasks.length;
		}
	}

	return (
		<div className="mb-6 w-full">
			{/* Row Header */}
			<div className="mb-2 flex items-center rounded bg-secondary/40 p-2">
				<Button
					variant="ghost"
					size="sm"
					className="mr-2 h-6 w-6 p-0"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					{isCollapsed ? (
						<ChevronRight className="size-4" />
					) : (
						<ChevronDown className="size-4" />
					)}
				</Button>
				<RowGroupHeader
					group={rowGroup}
					groupType={groupRowsBy}
					count={totalTasksInRow}
				/>
			</div>

			{/* Row Content */}
			{!isCollapsed && (
				<div
					className={cn(
						"grid gap-2",
						isListView ? "grid-cols-1" : `grid-cols-${groupedColumns.length}`,
					)}
				>
					{isListView ? (
						// List view - single column structure with all column headers
						<div className="w-full">
							{groupedColumns.map((column) => {
								const matchingRowGroup = column.rowGroups?.find(
									(group) => group.group === rowGroup,
								);
								if (!matchingRowGroup || matchingRowGroup.tasks.length === 0)
									return null;

								return (
									<div key={column.group} className="mb-4">
										<TaskColumnTitle
											title={column.group}
											showTasks={column.showTasks}
											setShowTasks={(show) => {
												// We'd need to update the column's showTasks property
												// This would require lifting state up to ViewAllTasks
												// For now, we'll log for debugging
												console.log(
													`Setting showTasks to ${show} for column ${column.group}`,
												);
											}}
											numberOfTasks={matchingRowGroup.tasks.length}
											isListView={isListView}
										/>
										<GroupColumn
											group={column.group}
											tasks={matchingRowGroup.tasks}
											currentView="list"
											showTasks={column.showTasks}
										/>
									</div>
								);
							})}
						</div>
					) : (
						// Grid view - multi-column layout
						groupedColumns.map((column) => {
							const matchingRowGroup = column.rowGroups?.find(
								(group) => group.group === rowGroup,
							);
							if (!matchingRowGroup)
								return <div key={column.group} className="w-72" />;

							return (
								<div key={column.group} className="w-72">
									<TaskColumnTitle
										title={column.group}
										showTasks={column.showTasks}
										setShowTasks={() => {}}
										numberOfTasks={matchingRowGroup.tasks.length}
										isListView={false}
									/>
									<GroupColumn
										group={column.group}
										tasks={matchingRowGroup.tasks}
										currentView="grid"
										showTasks={column.showTasks}
									/>
								</div>
							);
						})
					)}
				</div>
			)}
		</div>
	);
};
