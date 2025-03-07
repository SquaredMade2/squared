import { useViewStore } from "@/store";
import { cn } from "@/utils/cn";
import { Droppable } from "@hello-pangea/dnd";
import { ChevronDown, ChevronRight } from "@squared/icons";
import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
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
	visibleColumns,
}: {
	groupedColumns: GroupedColumn[];
	isListView: boolean;
	visibleColumns: Map<string, boolean>;
}) => {
	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy } = displayOptions;
	const getColumnVisibility = (columnGroup: string): boolean => {
		return visibleColumns.has(columnGroup)
			? // biome-ignore lint/style/noNonNullAssertion: We just checked that this key exists
				visibleColumns.get(columnGroup)!
			: true;
	};

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

	// Sort the row groups consistently based on type
	const uniqueRowGroups = Array.from(allRowGroups);

	return (
		<div className="flex h-full w-full flex-col">
			{/* Column headers - completely outside of scrollable area */}
			{!isListView && (
				<div className="z-30 mb-2 flex gap-2 bg-background pt-2 pb-2">
					{groupedColumns.map((column) => (
						<div key={`header-${column.group}`} className="w-72">
							<TaskColumnTitle
								title={column.group}
								showTasks={getColumnVisibility(column.group)}
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

			{/* Scrollable container for row groups only */}
			<ScrollArea className="max-h-[calc(100vh-145px)] flex-grow">
				{uniqueRowGroups.map((rowGroup) => (
					<RowGroup
						key={rowGroup}
						rowGroup={rowGroup}
						groupedColumns={groupedColumns}
						isListView={isListView}
						visibleColumns={visibleColumns}
					/>
				))}
			</ScrollArea>
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
	visibleColumns,
}: {
	rowGroup: string;
	groupedColumns: GroupedColumn[];
	isListView: boolean;
	visibleColumns: Map<string, boolean>;
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy, showSubTasks } = displayOptions;

	// Calculate total tasks in this row group across all columns
	let totalTasksInRow = 0;
	let visibleTasksInRow = 0;

	for (const column of groupedColumns) {
		const matchingRowGroup = column.rowGroups?.find(
			(group) => group.group === rowGroup,
		);

		if (matchingRowGroup) {
			// Count all tasks including subtasks for total
			totalTasksInRow += matchingRowGroup.tasks.length;

			// Count only visible tasks (parent tasks or visible subtasks)
			const visibleTasks = matchingRowGroup.tasks.filter(
				(task) => !task.parentId || (task.parentId && showSubTasks),
			);
			visibleTasksInRow += visibleTasks.length;
		}
	}

	// Don't render row if there are no visible tasks and no hidden subtasks
	if (visibleTasksInRow === 0 && totalTasksInRow === 0) {
		return null;
	}

	const getColumnVisibility = (columnGroup: string): boolean => {
		return visibleColumns.has(columnGroup)
			? // biome-ignore lint/style/noNonNullAssertion: We just checked that this key exists
				visibleColumns.get(columnGroup)!
			: true;
	};

	return (
		<div className="mb-8 w-full pb-4">
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
										<Droppable
											droppableId={`${column.group}-${rowGroup}`}
											type="TASK"
										>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.droppableProps}
													className={cn(
														"min-h-[40px] rounded p-1",
														snapshot.isDraggingOver && "bg-secondary/30",
													)}
												>
													<GroupColumn
														group={`${column.group}-${rowGroup}`}
														tasks={matchingRowGroup.tasks}
														currentView="list"
														showTasks={getColumnVisibility(column.group)}
													/>
													{provided.placeholder}
												</div>
											)}
										</Droppable>
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

							// Always render column placeholders to maintain layout
							return (
								<div key={column.group} className="w-72 flex-shrink-0">
									<Droppable
										droppableId={`${column.group}-${rowGroup}`}
										type="TASK"
									>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.droppableProps}
												className={cn(
													"min-h-[40px] rounded p-1",
													snapshot.isDraggingOver && "bg-secondary/30",
												)}
											>
												{matchingRowGroup &&
													matchingRowGroup.tasks.length > 0 && (
														<div className="h-auto overflow-visible">
															<GroupColumn
																group={`${column.group}-${rowGroup}`}
																tasks={matchingRowGroup.tasks}
																currentView="grid"
																showTasks={getColumnVisibility(column.group)}
															/>
														</div>
													)}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</div>
							);
						})
					)}
				</div>
			)}
		</div>
	);
};
