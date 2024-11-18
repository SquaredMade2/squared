"use client";

import { RenameModal } from "@/components/Modals";
import { useUserStore, useViewStore } from "@/store";
import {
	compareNullableDates,
	compareNullableNumbers,
	compareNullableStrings,
} from "@/utils/compareSorting";
import { Droppable } from "@hello-pangea/dnd";
import { Priority, Status, type Task } from "@squared/db";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import GroupColumn from "./GroupColumn";
import TaskCard from "./TaskCard";
import TaskColumnTitle from "./TaskColumnTitle";
import type { GroupedColumn, ViewAllTasksProps } from "./interfaces";

const priorityOrder = [
	Priority.noPriority,
	Priority.low,
	Priority.medium,
	Priority.high,
	Priority.urgent,
];

const statusOrder = [
	Status.backlog,
	Status.todo,
	Status.inProgress,
	Status.inReview,
	Status.done,
	Status.canceled,
	Status.archived,
];

const TaskMatrix = ({
	getGroupedColumns,
	getGroupedRows,
	tasks: allTasks,
}: ViewAllTasksProps) => {
	const { view, displayOptions } = useViewStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { groupTasksBy, rowGrouping, taskOrder } = displayOptions;
	const { orderBy, orderAscending } = taskOrder;
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

	let groupedRows = getGroupedRows();

	if (rowGrouping === "Status") {
		if (pathname.includes("/active")) {
			groupedRows = groupedRows.filter((column) =>
				activeStatusGroups.includes(column.group as Status),
			);
		} else if (pathname.includes("/backlog")) {
			groupedRows = groupedRows.filter(
				(column) => column.group === Status.backlog,
			);
		} else if (pathname.includes("/sprints/current")) {
			groupedRows = groupedRows.filter((column) =>
				currentSprintStatusGroups.includes(column.group as Status),
			);
		}
	}

	const getParentTaskIds = () => {
		const taskIdsForGroup = allTasks.map((t) => t.id);
		return allTasks
			.filter(
				(t) => t.parentId !== null && taskIdsForGroup.includes(t.parentId),
			)
			.map((t) => t.parentId);
	};

	const orderTasks = (tasks: Task[]): Task[] => {
		return tasks.sort((a, b) => {
			let comparison = 0;

			switch (orderBy) {
				case "Title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "Status":
					comparison =
						statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
					break;
				case "Priority":
					comparison =
						priorityOrder.indexOf(a.priority) -
						priorityOrder.indexOf(b.priority);
					break;
				case "Assignee": {
					const aAssignee =
						users.find((u) => u.id === a.assigneeId)?.name ?? null;
					const bAssignee =
						users.find((u) => u.id === b.assigneeId)?.name ?? null;
					comparison = compareNullableStrings(aAssignee, bAssignee);
					break;
				}
				case "Effort":
					comparison = compareNullableNumbers(
						a.effortEstimate,
						b.effortEstimate,
					);
					break;
				case "Due Date":
					comparison = compareNullableDates(a.dueDate, b.dueDate);
					break;
				case "Updated":
					comparison =
						new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
					break;
				case "Created":
					comparison =
						new Date(a.dateCreated).getTime() -
						new Date(b.dateCreated).getTime();
					break;
				default:
					break;
			}

			return orderAscending ? comparison : -comparison;
		});
	};

	const renderTask = (task: Task, index: number) => (
		<div
			key={task.id}
			className={`mb-2 last:mb-0 ${view === "list" ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard task={task} index={index} location={"dashboard"} />
		</div>
	);

	const renderTaskWithSubtasks = (
		task: Task,
		index: number,
		subtasks: Task[],
	) => (
		<div
			key={task.id}
			className={`mb-2 last:mb-0 ${view === "list" ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard task={task} index={index} location={"dashboard"} />
			{subtasks.length > 0 && displayOptions.showSubTasks && (
				<div
					className={`mt-1 bg-secondary dark:bg-secondary/30 ${
						view === "list"
							? "w-full rounded-b-lg px-2 pb-2"
							: "w-72 rounded-lg p-2"
					}`}
				>
					{subtasks.map((subtask, subIndex) => (
						<TaskCard
							key={subtask.id}
							task={subtask}
							index={subIndex}
							location={"dashboard"}
							isSubtask={true}
						/>
					))}
				</div>
			)}
		</div>
	);

	const renderSubtasks = (parentTask: Task | undefined, subtasks: Task[]) => (
		<div
			key={parentTask?.id}
			className={`mt-1 bg-secondary dark:bg-secondary/30 ${
				view === "list"
					? "w-full rounded-b-lg px-2 py-2 "
					: "w-72 rounded-lg p-2"
			}`}
		>
			<span
				className={`text-accent-foreground truncate max-w-[250px] inline-block ${view === "list" ? "ml-10" : "ml-2"}`}
			>
				{parentTask?.identifier}: {parentTask?.title}
			</span>
			{subtasks.map((subtask, index) => (
				<TaskCard
					key={subtask.id}
					task={subtask}
					index={index}
					location={"dashboard"}
					isSubtask={true}
				/>
			))}
		</div>
	);

	const renderGroup = (tasks: Task[]) => {
		console.log("tasks to render: ", tasks);
		const parentIdsForGroup = getParentTaskIds();
		const subtaskParentIds = new Set(
			tasks.filter((t) => t.parentId).map((t) => t.parentId),
		);

		const renderableItems = tasks
			.map((task) => {
				if (!task.parentId) {
					const isParentTask = parentIdsForGroup.includes(task.id);
					if (isParentTask) {
						const subtasks = tasks.filter((t) => t.parentId === task.id);
						return {
							task,
							render: (index: number) =>
								renderTaskWithSubtasks(task, index, subtasks),
						};
					}
					return {
						task,
						render: (index: number) => renderTask(task, index),
					};
				}
				return null;
			})
			.filter(Boolean);

		const orphanedSubtaskGroups = Array.from(subtaskParentIds)
			.map((id) => {
				if (parentIdsForGroup.includes(id)) return null;
				const parentTask = allTasks.find((t) => t.id === id);
				const subtasks = tasks.filter((t) => t.parentId === id);
				return {
					task: parentTask,
					render: () => renderSubtasks(parentTask, subtasks),
				};
			})
			.filter(Boolean);

		const allItems = [...renderableItems, ...orphanedSubtaskGroups];
		const sortedItems = orderTasks(
			allItems
				.map((item) => item?.task)
				.filter((task): task is Task => task !== undefined),
		);

		return sortedItems.map((sortedTask, index) => {
			const item = allItems.find((item) => item?.task?.id === sortedTask.id);
			return item?.render(index);
		});
	};

	// console.log("groupedColumns", groupedColumns);
	// console.log("groupedRows", groupedRows);
	return (
		<>
			<RenameModal />
			{rowGrouping ? (
				<div className={view === "list" ? "block min-w-full" : "flex"}>
					<div className="flex flex-nowrap gap-4 mb-4">
						{groupedColumns.map(({ group, tasks }) => (
							<TaskColumnTitle
								key={group}
								title={group}
								numberOfTasks={tasks.length}
								isListView={view === "list"}
							/>
						))}
					</div>
					{Object.entries(groupedRows).map(([group, { tasks }]) => (
						<Collapsible key={group} className="mb-4">
							<CollapsibleTrigger className="flex items-center w-full p-2 bg-muted rounded-t-md">
								<ChevronRight className="h-4 w-4 mr-2" />
								<span className="font-semibold">{group}</span>
								<span className="ml-2 text-muted-foreground">
									({tasks.length})
								</span>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<div className="flex flex-nowrap gap-4 bg-muted/30 p-2 rounded-b-md">
									{groupedColumns.map((column) => {
										const tasksForColumn = tasks.filter(
											(task) => task.status === column.group,
										);
										console.log("tasksForColumn", tasksForColumn);
										return (
											<Droppable
												key={`${group}-${column.group}`}
												droppableId={`${group}-${column.group}`}
											>
												{(provided) => (
													<div
														{...provided.droppableProps}
														ref={provided.innerRef}
														className="space-y-2"
													>
														{renderGroup(
															tasks.filter(
																(task) => task.status === column.group,
															),
														)}
														{provided.placeholder}
													</div>
												)}
											</Droppable>
										);
									})}
								</div>
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			) : (
				groupedColumns.map((column: GroupedColumn) => (
					<GroupColumn
						key={column.group}
						group={column.group}
						tasks={column.tasks}
						currentView={view}
					/>
				))
			)}
		</>
	);
};

export default TaskMatrix;
