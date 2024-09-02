import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import TaskStatusSection from "@/components/TaskStatusSection";
import type { FilterStatusColumnProps } from "./FilterStatusColumn.interfaces";
import type { RootState } from "@/store";
import type { Task } from "@repo/db";

const StatusColumn = ({ columnType }: FilterStatusColumnProps) => {
	const filteredTaskList = useSelector(
		(state: RootState) => state.filterPage.filteredTaskList,
	);
	const taskList = useSelector((state: RootState) => state.taskData.taskList);

	const matchedTasks = taskList.filter((task: Task) =>
		filteredTaskList.some(
			(filteredTask) => filteredTask.id.toString() === task.id,
		),
	);

	const column = matchedTasks.filter(
		(task: Task) => task.status === columnType,
	);

	return (
		<>
			<Droppable droppableId={columnType}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`${snapshot.isDraggingOver ? "bg-accent" : ""} w-[100%]`}
					>
						<TaskStatusSection
							key={columnType}
							filteredTasks={column}
							isListView={false}
							showTasks={true}
							title={columnType}
						/>
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</>
	);
};

export default StatusColumn;
