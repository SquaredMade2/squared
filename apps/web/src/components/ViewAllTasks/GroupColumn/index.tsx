import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { useUsers } from "@/hooks/useUsers";
import { useViewStore, useWorkspaceStore } from "@/store";
import type { TaskGroup } from "@/store/views";
import { cn } from "@/utils/cn";
import {
	formatName,
	formatPriority,
	formatStatus,
	getInitials,
} from "@/utils/formatting";
import type {
	DroppableProvided,
	DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import type { Priority, Status } from "@squaredmade/db";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { UserSearch } from "lucide-react";
import { GridColumnNewTaskButton } from "../../Modals";
import type { GroupColumnProps } from "../interfaces";
import Group from "./Group";

const GroupColumn = ({
	group,
	tasks,
	rowGroups,
	currentView: view,
	showTasks,
}: GroupColumnProps) => {
	const isListView = view === "list";
	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy } = displayOptions;

	// Check if row grouping is active
	const isRowGroupingActive = groupRowsBy !== "None";

	// For row grouping, the group prop may be a composite ID like "todo-urgent"
	// We only need the first part for status when creating the "Add Task" button
	const columnStatus = group.includes("-") ? group.split("-")[0] : group;

	return (
		<div className={isListView ? "mb-2 w-full" : "w-72 shrink-0 pr-2 pb-2"}>
			{/* When row grouping is active, the Droppable is already created in RowGroupingWrapper */}
			{!isRowGroupingActive ? (
				<Droppable
					droppableId={group}
					type="TASK"
					direction="vertical"
					isCombineEnabled={true}
					ignoreContainerClipping={true}
				>
					{(
						dropProvided: DroppableProvided,
						dropSnapshot: DroppableStateSnapshot,
					) => (
						<div
							className={cn(
								isListView
									? "z-30 flex w-full flex-col items-start gap-2"
									: cn(
											"9fr] mb-2 grid w-72 grow grid-rows-[1fr rounded-lg bg-card transition-all duration-500 ease-in-out",
											// Remove height constraint when row grouping is active
											!isRowGroupingActive && "h-[calc(100vh-250px)]",
										),
								dropSnapshot.isDraggingOver && "bg-[#242d42]",
							)}
						>
							<div
								className={cn(
									"w-full overflow-auto",
									!isRowGroupingActive &&
										"scrollbar-thin scrollbar-thumb-[#DBE0E3] dark:scrollbar-thumb-[#2C2C3B] dark:scrollbar-[#2C2C3B] scrollbar-track-transparent dark:scrollbar-track-transparent",
								)}
							>
								<div
									className={cn(
										"w-full grow",
										isListView ? "flex flex-col" : "inline-flex",
									)}
								>
									<div
										ref={dropProvided.innerRef}
										{...dropProvided.droppableProps}
										className="flex w-full flex-col items-start"
									>
										{showTasks &&
											(rowGroups && rowGroups.length > 0 ? (
												// Render grouped rows
												rowGroups.map((rowGroup) => (
													<div
														key={`${group}-${rowGroup.group}`}
														className="mb-4 w-full"
													>
														<div className="mb-2 rounded bg-secondary/40 p-2">
															<RowGroupHeader
																group={rowGroup.group}
																groupType={groupRowsBy}
																count={rowGroup.tasks.length}
															/>
														</div>
														<Group
															tasks={rowGroup.tasks}
															isListView={isListView}
														/>
													</div>
												))
											) : (
												// Original group rendering
												<Group tasks={tasks} isListView={isListView} />
											))}
										{dropProvided.placeholder}
									</div>
								</div>
							</div>
						</div>
					)}
				</Droppable>
			) : (
				/* With row grouping active, GroupColumn just renders the tasks */
				<div className="flex w-full flex-col items-start">
					{showTasks && <Group tasks={tasks} isListView={isListView} />}
				</div>
			)}
			{!isListView && <GridColumnNewTaskButton group={columnStatus} />}
		</div>
	);
};

// Reuse the RowGroupHeader component
const RowGroupHeader = ({
	group,
	groupType,
	count,
}: {
	group: string;
	groupType: TaskGroup | "None";
	count: number;
}) => {
	const { users } = useUsers();
	const workspace = useWorkspaceStore((state) => state.workspace);

	switch (groupType) {
		case "Status":
			return (
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<StatusIcon status={group as Status} />
						<span className="ml-2 font-medium text-sm">
							{formatStatus(group as Status)}
						</span>
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		case "Priority":
			return (
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<PriorityIcon priority={group as Priority} />
						<span className="ml-2 font-medium text-sm">
							{formatPriority(group as Priority)}
						</span>
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		case "Assignee": {
			const user = users?.find((u) => u.userId === group);
			return (
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						{user ? (
							<>
								<Avatar className="size-5 text-xxs">
									<AvatarImage src={user.imageUrl ?? ""} />
									<AvatarFallback>
										{getInitials(formatName(user))}
									</AvatarFallback>
								</Avatar>
								<span className="ml-2 font-medium text-sm">
									{formatName(user)}
								</span>
							</>
						) : (
							<>
								<UserSearch className="size-4 text-muted-foreground" />
								<span className="ml-2 font-medium text-sm">Unassigned</span>
							</>
						)}
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		}
		case "Label": {
			const label = workspace?.labels.find((l) => l.name === group);
			return (
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						{label && (
							<div
								className="mr-2 h-3 w-3 rounded-full"
								style={{ backgroundColor: label.color }}
							/>
						)}
						<span className="font-medium text-sm">{group}</span>
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		}
		default:
			return <span>{group}</span>;
	}
};

export default GroupColumn;
