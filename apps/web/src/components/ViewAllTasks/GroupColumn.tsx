import { useTaskStore, useViewStore } from "@/store";
import {
	compareNullableDates,
	compareNullableNumbers,
	compareNullableStrings,
} from "@/utils/compareSorting";
import { Droppable } from "@hello-pangea/dnd";
import { Priority, Status, type Task } from "@squared/db";
import { useState } from "react";
import { GridColumnNewIssueButton } from "../Modals";
import { ScrollArea } from "../ui/scroll-area";
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
	const { tasks: allTasks } = useTaskStore((state) => state);

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
				case "Assignee":
					comparison = compareNullableStrings(a.assigneeName, b.assigneeName);
					break;
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

	const orderedTasks = orderTasks(tasks);

	const renderTask = (task: Task, index: number) => (
		<div
			key={task.id}
			className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
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
			className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard task={task} index={index} location={"dashboard"} />
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
						/>
					))}
				</div>
			)}
		</div>
	);

	const renderSubtasks = (parentTask: Task | undefined, subtasks: Task[]) => (
		<div
			className={`mt-1 bg-secondary dark:bg-secondary/30 ${
				isListView ? "w-full rounded-b-lg px-2 py-2 " : "w-72 rounded-lg p-2"
			}`}
		>
			<span
				className={`text-accent-foreground truncate ${isListView ? "ml-10" : "ml-2"}`}
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
		const parentIdsForGroup = getParentTaskIds();
		const subtaskParentIds = new Set(
			tasks.filter((t) => t.parentId).map((t) => t.parentId),
		);
		return [
			tasks
				.filter((t) => !t.parentId)
				.map((task, index) => {
					const isParentTask = parentIdsForGroup.includes(task.id);

					if (isParentTask) {
						const subtasks = tasks.filter((t) => t.parentId === task.id);
						return renderTaskWithSubtasks(task, index, subtasks);
					}
					return renderTask(task, index);
				}),
			//render subtask in a different group from parent task
			Array.from(subtaskParentIds).map((id) => {
				const parentTask = allTasks.find((t) => t.id === id);
				const subtasks = tasks.filter((t) => t.parentId === id);
				if (parentIdsForGroup.includes(id)) return;
				return renderSubtasks(parentTask, subtasks);
			}),
		];
	};

	return (
		<div
			className={
				isListView ? "mb-2 w-full" : "pb-2 pr-2 w-[300px] flex-shrink-0"
			}
		>
			<TaskColumnTitle
				title={group}
				showTasks={showTasks}
				setShowTasks={setShowTasks}
				numberOfTasks={tasks.length}
				isListView={isListView}
			/>
			<Droppable droppableId={group}>
				{(provided, snapshot) => (
					<ScrollArea
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`
              ${snapshot.isDraggingOver ? "h-full" : ""}
              ${
								snapshot.isDraggingOver && view === "grid"
									? ""
									: `${
											view === "grid"
												? "h-[calc(100vh-250px)] mb-2 flex-grow overflow-y-auto rounded transition-all duration-500 ease-in-out"
												: "overflow-y-auto"
										}`
							} 
            `}
					>
						<div
							className={
								isListView
									? "grid grid-rows-[1fr 9fr] rounded-lg bg-card w-full"
									: "flex flex-col z-30 w-full gap-2 items-center"
							}
						>
							{showTasks && renderGroup(orderedTasks)}
							{/* // orderedTasks.map((task, index) => renderGroup(task, index))} */}
						</div>
						{provided.placeholder}
					</ScrollArea>
				)}
			</Droppable>
			{!isListView && <GridColumnNewIssueButton group={group} />}
		</div>
	);
};

export default GroupColumn;
