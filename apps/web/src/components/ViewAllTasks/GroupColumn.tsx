import { useTaskStore, useUserStore, useViewStore } from "@/store";
import { useFilterStore } from "@/store";
import {
	compareNullableDates,
	compareNullableNumbers,
	compareNullableStrings,
} from "@/utils/compareSorting";
import { Droppable } from "@hello-pangea/dnd";
import type {
	DroppableProvided,
	DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { Priority, Status, type Task } from "@squared/db";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GridColumnNewTaskButton } from "../Modals";
import TaskCard from "./TaskCard";
import TaskColumnTitle from "./TaskColumnTitle";
import type { GroupColumnProps } from "./interfaces";
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

const GroupColumn = ({ group, tasks, currentView: view }: GroupColumnProps) => {
	const [showTasks, setShowTasks] = useState(true);
	const isListView = view === "list";
	const { displayOptions } = useViewStore((state) => state);
	const { orderBy, orderAscending } = displayOptions.taskOrder;
	const { tasks: allTasks, allBlockedTaskIds } = useTaskStore((state) => state);
	const users = useUserStore((state) => state.users);
	const pathname = usePathname();

	const { savedFilters } = useFilterStore((state) => state);

	const currentSavedFilter = pathname.split("/").includes("views")
		? savedFilters.filter((filter) => {
				const filterSlugArray = filter.id.split("-");
				const filterSlug = filterSlugArray[0];

				const pathNameSlug = pathname.split("-").pop();

				return filterSlug === pathNameSlug;
			})[0]
		: null;

	const getParentTaskIds = () => {
		const taskIdsForGroup = tasks.map((t) => t.id);
		return tasks
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
						users.find((u) => u.externalId === a.assigneeId)?.name ?? null;
					const bAssignee =
						users.find((u) => u.externalId === b.assigneeId)?.name ?? null;
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
			className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard
				task={task}
				index={index}
				location={"dashboard"}
				isDisabled={!!allBlockedTaskIds.find((id) => id === task.id)}
			/>
		</div>
	);

	const renderTaskWithSubtasks = (
		task: Task,
		index: number,
		subtasks: Task[],
	) => (
		<div
			key={task.id}
			className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard
				task={task}
				index={index}
				location={"dashboard"}
				isDisabled={!!allBlockedTaskIds.find((id) => id === task.id)}
			/>
			{subtasks.length > 0 && displayOptions.showSubTasks && (
				<div
					className={`mt-1 bg-secondary dark:bg-secondary/30 ${
						isListView ? "w-full rounded-b-lg px-2 pb-2" : "w-72 rounded-lg p-2"
					}`}
				>
					{subtasks.map((subtask, subIndex) => (
						<TaskCard
							key={subtask.id}
							task={subtask}
							index={subIndex}
							location={"dashboard"}
							isSubtask={true}
							isDisabled={!!allBlockedTaskIds.find((id) => id === subtask.id)}
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
				isListView ? "w-full rounded-b-lg px-2 py-2 " : "w-72 rounded-lg p-2"
			}`}
		>
			<span
				className={`inline-block max-w-[250px] truncate text-accent-foreground ${isListView ? "ml-10" : "ml-2"}`}
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
					isDisabled={!!allBlockedTaskIds.find((id) => id === subtask.id)}
				/>
			))}
		</div>
	);

	const renderGroup = (tasks: Task[]) => {
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

		if (currentSavedFilter) {
			const sprintId = currentSavedFilter.sprintId;

			// if no sprintId then render all tasks
			if (!sprintId) {
				return sortedItems.map((sortedTask, index) => {
					const item = allItems.find((item) => {
						return item?.task?.id === sortedTask.id;
					});
					return item?.render(index);
				});
			}
			// else render items with matching sprintId
			return sortedItems.map((sortedTask, index) => {
				const item = allItems.find((item) => {
					return (
						item?.task?.id === sortedTask.id && item?.task.sprintId === sprintId
					);
				});
				return item?.render(index);
			});
		}

		return sortedItems.map((sortedTask, index) => {
			const item = allItems.find((item) => {
				return item?.task?.id === sortedTask.id;
			});
			return item?.render(index);
		});
	};

	return (
		<div
			className={
				isListView ? "mb-2 w-full" : "w-[300px] flex-shrink-0 pr-2 pb-2"
			}
		>
			<TaskColumnTitle
				title={group}
				showTasks={showTasks}
				setShowTasks={setShowTasks}
				numberOfTasks={tasks.length}
				isListView={isListView}
			/>
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
						className={`
							${
								view === "grid"
									? "9fr] mb-2 grid h-[calc(100vh-250px)] w-full flex-grow grid-rows-[1fr rounded-lg bg-card transition-all duration-500 ease-in-out"
									: "z-30 flex h-full w-full flex-col items-center gap-2"
							}
							${dropSnapshot.isDraggingOver && "bg-[#242d42]"}
							`}
					>
						<div className="scrollbar-thin scrollbar-thumb-[#DBE0E3] scrollbar-thumb-[#DBE0E3] dark:scrollbar-thumb-[#2C2C3B] dark:scrollbar-[#2C2C3B] scrollbar-track-transparent dark:scrollbar-track-transparent w-full overflow-auto">
							<div className="inline-flex w-full grow">
								<div
									ref={dropProvided.innerRef}
									className="flex min-h-[60px] w-full min-w-[200px] flex-col items-start"
								>
									{showTasks && renderGroup(tasks)}
									{dropProvided.placeholder}
								</div>
							</div>
						</div>
					</div>
				)}
			</Droppable>
			{!isListView && <GridColumnNewTaskButton group={group} />}
		</div>
	);
};

export default GroupColumn;
