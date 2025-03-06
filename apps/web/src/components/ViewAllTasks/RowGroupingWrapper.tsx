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
			{/* Render column headers only once at the top */}
			{!isListView && (
				<div className="mb-4 flex gap-2">
					{groupedColumns.map((column) => (
						<div key={`header-${column.group}`} className="w-72">
							<TaskColumnTitle
								title={column.group}
								showTasks={column.showTasks}
								setShowTasks={(show) => {
									console.log(
										`Setting showTasks to ${show} for column ${column.group}`,
									);
								}}
								numberOfTasks={column.tasks.length}
								isListView={false}
							/>
						</div>
					))}
				</div>
			)}

			{/* For list view, we'll render one consolidated set of column titles at the top */}
			{isListView && (
				<div className="mb-4 w-full">
					<div className="mb-2 flex items-center rounded bg-card p-2">
						<span className="font-medium">Columns</span>
					</div>
				</div>
			)}

			{/* Render row groups */}
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
			{/* Row Header - full width regardless of collapsed state */}
			<div
				className={cn(
					"mb-2 flex w-full items-center rounded bg-secondary/40 p-2",
				)}
			>
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
				<div className={isListView ? "w-full" : "flex gap-2"}>
					{isListView ? (
						// List view - single column structure without duplicate column headers
						<div className="w-full">
							{groupedColumns.map((column) => {
								const matchingRowGroup = column.rowGroups?.find(
									(group) => group.group === rowGroup,
								);
								if (!matchingRowGroup || matchingRowGroup.tasks.length === 0)
									return null;

								return (
									<div key={column.group} className="mb-4">
										<div className="mb-2 rounded bg-secondary/20 p-2">
											<span className="font-medium">{column.group}</span>
											<span className="ml-2 text-muted-foreground text-xs">
												({matchingRowGroup.tasks.length})
											</span>
										</div>
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
						// Grid view - multi-column layout without column headers (already at top)
						groupedColumns.map((column) => {
							const matchingRowGroup = column.rowGroups?.find(
								(group) => group.group === rowGroup,
							);

							// Always render all column placeholders to maintain layout
							return (
								<div key={column.group} className="w-72">
									{matchingRowGroup && matchingRowGroup.tasks.length > 0 && (
										<GroupColumn
											group={column.group}
											tasks={matchingRowGroup.tasks}
											currentView="grid"
											showTasks={column.showTasks}
										/>
									)}
								</div>
							);
						})
					)}
				</div>
			)}
		</div>
	);
};
