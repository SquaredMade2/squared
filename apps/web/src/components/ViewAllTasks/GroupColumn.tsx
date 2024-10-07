import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskColumnTitle from "./TaskColumnTitle";
import type { StatusColumnProps } from "./interfaces";
import { ScrollArea } from "../ui/scroll-area";
import { GridColumnNewIssueButton } from "../Modals";
import TaskCard from "./TaskCard";
import { Priority, Status, type Task } from "@repo/db";
import { useViewStore, useTaskStore } from "@/store";
import {
	compareNullableDates,
	compareNullableNumbers,
	compareNullableStrings,
} from "@/utils/compareSorting";

const StatusColumn = ({
	columnType,
	title,
	tasks,
	currentView: view,
	sprintId,
}: StatusColumnProps) => {
	const [showTasks, setShowTasks] = useState(true);
	const numberOfTasks = tasks.length;
	const isListView = view === "list";
	const { listViewOptions, gridViewOptions } = useViewStore((state) => state);
	const { tasks: allTasks } = useTaskStore((state) => state);

	const viewOptions = view === "list" ? listViewOptions : gridViewOptions;

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

	const orderTasks = (
		tasks: Task[],
		orderBy: string,
		orderAscending: boolean,
	): Task[] => {
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

	const orderedTasks = orderTasks(
		tasks,
		viewOptions.taskOrder.orderBy,
		viewOptions.taskOrder.orderAscending,
	);

	const renderTaskWithSubtasks = (task: Task, index: number) => {
		const subtasks = allTasks.filter((t) => t.parentId === task.id);
		return (
			<div key={task.id} className={`mb-2 ${isListView ? "w-full" : "w-72"}`}>
				<TaskCard task={task} index={index} location={"dashboard"} />
				{subtasks.length > 0 && (
					<div
						className={`mt-1 ${
							isListView
								? "w-full rounded-b-lg px-2 pb-2 bg-secondary dark:bg-secondary/30"
								: "w-72 dark:bg-secondary/30 bg-secondary rounded-lg p-2"
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
	};

	return (
		<div
			className={isListView ? "mb-2 w-full" : "pb-2 w-[300px] flex-shrink-0"}
		>
			<TaskColumnTitle
				isListView={isListView}
				showTasks={showTasks}
				numberOfTasks={numberOfTasks}
				title={title}
				setShowTasks={setShowTasks}
				sprintId={sprintId}
			/>
			<Droppable droppableId={columnType}>
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
											view === "grid" &&
											"h-[77vh] rounded pr-2 transition-all duration-500 ease-in-out"
										}`
							} 
            `}
					>
						<div
							className={
								isListView
									? "grid grid-rows-[1fr 9fr] rounded-lg bg-card w-full"
									: "flex flex-col z-30 w-full min-h-[135px] pb-1 gap-2 items-center"
							}
						>
							{showTasks &&
								orderedTasks
									.filter((task) => !task.parentId)
									.map((task, index) => renderTaskWithSubtasks(task, index))}
							{!isListView && (
								<GridColumnNewIssueButton status={title as Status} />
							)}
						</div>
						{provided.placeholder}
					</ScrollArea>
				)}
			</Droppable>
		</div>
	);
};

export default StatusColumn;
