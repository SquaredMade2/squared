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

const GroupColumn = ({ group, tasks, currentView: view }: GroupColumnProps) => {
	const [showTasks, setShowTasks] = useState(true);
	const numberOfTasks = tasks.length;
	const isListView = view === "list";
	const { displayOptions } = useViewStore((state) => state);
	const { taskOrder } = displayOptions;
	const { orderBy, orderAscending } = taskOrder;
	const { tasks: allTasks } = useTaskStore((state) => state);

	const getParentTaskIds = () => {
		const taskIdsForGroup = tasks.map((t) => t.id);
		return tasks
			.filter(
				(t) => t.parentId !== null && taskIdsForGroup.includes(t.parentId),
			)
			.map((t) => t.parentId);
	};

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

	const renderTaskWithSubtasks = (task: Task, index: number) => {
		const parentTaskIds = getParentTaskIds();
		const isParentTask = parentTaskIds.includes(task.id);
		const isSubtask = task.parentId !== null;
		const isSubtaskWithParent = parentTaskIds.includes(task.parentId);
		if (isParentTask) {
			const subtasksForParent = tasks.filter((t) => t.parentId === task.id);
			return (
				<div
					key={task.id}
					className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
				>
					<TaskCard task={task} index={index} location={"dashboard"} />
					{subtasksForParent.length > 0 && displayOptions.showSubTasks && (
						<div
							className={`mt-1 ${
								isListView
									? "w-full rounded-b-lg px-2 pb-2 bg-secondary dark:bg-secondary/30"
									: "w-72 dark:bg-secondary/30 bg-secondary rounded-lg p-2"
							}`}
						>
							{subtasksForParent.map((subtask, subIndex) => (
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
		}
		if (isSubtask) {
			if (isSubtaskWithParent) return;
			//render subtask in a different group from parent task
			const parentTask = allTasks.find((t) => t.id === task.parentId);
			return (
				<div
					className={`mt-1 ${
						isListView
							? "w-full rounded-b-lg px-2 pb-2 bg-secondary dark:bg-secondary/30"
							: "w-72 dark:bg-secondary/30 bg-secondary rounded-lg p-2"
					}`}
				>
					<span className="text-">
						{parentTask?.identifier}: {parentTask?.title}
					</span>
					<TaskCard
						key={task.id}
						task={task}
						index={index}
						location={"dashboard"}
						isSubtask={true}
					/>
				</div>
			);
		}
		return (
			<div
				key={task.id}
				className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
			>
				<TaskCard task={task} index={index} location={"dashboard"} />
			</div>
		);
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
				numberOfTasks={numberOfTasks}
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
							{showTasks &&
								orderedTasks
									// .filter((task) => !task.parentId)
									.map((task, index) => renderTaskWithSubtasks(task, index))}
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
