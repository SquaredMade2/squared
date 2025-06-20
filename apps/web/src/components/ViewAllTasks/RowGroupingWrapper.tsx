import { Droppable } from "@hello-pangea/dnd";
import { ChevronDown, ChevronRight } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useViewStore } from "@/store";
import GroupColumn from "./GroupColumn";
import type { GroupedColumn } from "./interfaces";
import { RowGroupHeader } from "./RowGroupHeader";
import TaskColumnTitle from "./TaskColumnTitle";

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
	const { groupRowsBy, groupTasksBy } = displayOptions;
	const getColumnVisibility = (columnGroup: string): boolean => {
		return visibleColumns.has(columnGroup)
			? // biome-ignore lint/style/noNonNullAssertion: We just checked that this key exists
				visibleColumns.get(columnGroup)!
			: true;
	};

	// Get all unique row groups across all columns
	const allRowGroups = new Set<string>();
	for (const column of groupedColumns) {
		for (const rowGroup of column.rowGroups ?? []) {
			allRowGroups.add(rowGroup.group);
		}
	}

	// Sort the row groups consistently based on type
	const uniqueRowGroups = Array.from(allRowGroups);

	// Track collapsed state for each column and row group (for list view)
	const [collapsedColumns, setCollapsedColumns] = useState<
		Record<string, boolean>
	>({});
	const [collapsedRowGroups, setCollapsedRowGroups] = useState<
		Record<string, Record<string, boolean>>
	>({});

	// Toggle column collapsed state
	const toggleColumnCollapsed = (columnGroup: string) => {
		setCollapsedColumns((prev) => ({
			...prev,
			[columnGroup]: !prev[columnGroup],
		}));
	};

	// Toggle row group collapsed state
	const toggleRowGroupCollapsed = (columnGroup: string, rowGroup: string) => {
		setCollapsedRowGroups((prev) => ({
			...prev,
			[columnGroup]: {
				...(prev[columnGroup] || {}),
				[rowGroup]: !(prev[columnGroup]?.[rowGroup]),
			},
		}));
	};

	// Check if a column is collapsed
	const isColumnCollapsed = (columnGroup: string): boolean => {
		return collapsedColumns[columnGroup];
	};

	// Check if a row group is collapsed
	const isRowGroupCollapsed = (
		columnGroup: string,
		rowGroup: string,
	): boolean => {
		return collapsedRowGroups[columnGroup]?.[rowGroup];
	};

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
									visibleColumns.set(column.group, show);
								}}
								numberOfTasks={column.tasks.length}
								isListView={false}
							/>
						</div>
					))}
				</div>
			)}

			{/* Scrollable container */}
			<ScrollArea className="max-h-[calc(100vh-145px)] w-full grow pr-2">
				{isListView ? (
					// List view - organize by columns first, then by row groups
					<div className="w-full">
						{groupedColumns.map((column) => (
							<div key={column.group} className="mb-6">
								{/* Column header */}
								<button
									type="button"
									className="mb-2 flex cursor-pointer items-center justify-between rounded bg-secondary/40 p-2"
									onClick={() => toggleColumnCollapsed(column.group)}
								>
									<div className="flex items-center">
										<Button
											variant="ghost"
											size="sm"
											className="mr-2 h-6 w-6 p-0"
										>
											{isColumnCollapsed(column.group) ? (
												<ChevronRight className="size-4" />
											) : (
												<ChevronDown className="size-4" />
											)}
										</Button>
										<RowGroupHeader
											group={column.group}
											groupType={groupTasksBy}
											count={column.tasks.length}
										/>
									</div>
								</button>

								{/* Row groups within this column */}
								{!isColumnCollapsed(column.group) && (
									<div className="pl-6">
										{uniqueRowGroups.map((rowGroup) => {
											const matchingRowGroup = column.rowGroups?.find(
												(group) => group.group === rowGroup,
											);

											if (
												!matchingRowGroup ||
												matchingRowGroup.tasks.length === 0
											)
												return null;

											return (
												<div
													key={`${column.group}-${rowGroup}`}
													className="mb-4"
												>
													{/* Row group subheader */}
													<button
														type="button"
														className="mb-2 flex cursor-pointer items-center rounded bg-secondary/20 p-2"
														onClick={() =>
															toggleRowGroupCollapsed(column.group, rowGroup)
														}
													>
														<Button
															variant="ghost"
															size="sm"
															className="mr-2 h-6 w-6 p-0"
														>
															{isRowGroupCollapsed(column.group, rowGroup) ? (
																<ChevronRight className="size-3" />
															) : (
																<ChevronDown className="size-3" />
															)}
														</Button>
														<RowGroupHeader
															group={rowGroup}
															groupType={groupRowsBy}
															count={matchingRowGroup.tasks.length}
														/>
													</button>

													{/* Tasks within this row group */}
													{!isRowGroupCollapsed(column.group, rowGroup) && (
														<Droppable
															droppableId={`${column.group}-${rowGroup}`}
															type="TASK"
														>
															{(provided, snapshot) => (
																<div
																	ref={provided.innerRef}
																	{...provided.droppableProps}
																	className={cn(
																		"min-h-[40px] rounded p-1 pl-6",
																		snapshot.isDraggingOver &&
																			"bg-secondary/30",
																	)}
																>
																	<GroupColumn
																		group={`${column.group}-${rowGroup}`}
																		tasks={matchingRowGroup.tasks}
																		currentView="list"
																		showTasks={getColumnVisibility(
																			column.group,
																		)}
																	/>
																	{provided.placeholder}
																</div>
															)}
														</Droppable>
													)}
												</div>
											);
										})}
									</div>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="mb-8">
						{/* // Grid view - organize by row groups first, then columns */}
						{uniqueRowGroups.map((rowGroup) => (
							<RowGroup
								key={rowGroup}
								rowGroup={rowGroup}
								groupedColumns={groupedColumns}
								visibleColumns={visibleColumns}
							/>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

/**
 * A component that renders a single row group spanning all columns
 * Note: Only used for Grid view now
 */
const RowGroup = ({
	rowGroup,
	groupedColumns,
	visibleColumns,
}: {
	rowGroup: string;
	groupedColumns: GroupedColumn[];
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
		<div className="w-full pb-4">
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

			{/* Row Content for Grid View */}
			{!isCollapsed && (
				<div className="flex gap-2">
					{groupedColumns.map((column) => {
						const matchingRowGroup = column.rowGroups?.find(
							(group) => group.group === rowGroup,
						);

						// Always render column placeholders to maintain layout
						return (
							<div key={column.group} className="w-72 shrink-0">
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
					})}
				</div>
			)}
		</div>
	);
};
