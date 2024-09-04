import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskStatusSection from "@/components/TaskStatusSection";
import TaskColumnTitle from "@/components/TaskColumnTitle";
import type { Task } from "@repo/db";
import type { StatusColumnProps } from "./StatusColumn.interfaces";
import { ScrollArea } from "../ui/scroll-area";
import { useViewsStore } from "@/storeZ/provider";

const StatusColumn = ({
	columnType,
	title,
	setShowRenameModal,
	setTaskData,
	tasks,
}: StatusColumnProps) => {
	const [showTasks, setShowTasks] = useState(true);
	const { view } = useViewsStore().getState();
	const numberOfTasks = tasks.length;
	const isListView = view === "list";

	const toggleShowTasks = () => {
		setShowTasks((prevState) => !prevState);
	};

	return (
		<div className={isListView ? "mb-2" : "pb-2"}>
			<TaskColumnTitle
				isListView={isListView}
				showTasks={showTasks}
				numberOfTasks={numberOfTasks}
				title={title}
				toggleShowTasks={toggleShowTasks}
			/>
			<Droppable droppableId={columnType}>
				{(provided, snapshot) => (
					<ScrollArea
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`
						${snapshot.isDraggingOver ? "h-full" : ""}${
							snapshot.isDraggingOver && view === "grid"
								? ""
								: `${view === "grid" && "h-[77vh] sm:h-[86vh] rounded pr-2 transition-all duration-500 ease-in-out"}`
						} 
						`}
					>
						<TaskStatusSection
							key={columnType}
							isListView={isListView}
							filteredTasks={tasks}
							showTasks={showTasks}
							setShowRenameModal={setShowRenameModal}
							setTaskData={setTaskData}
							title={columnType}
						/>
						{provided.placeholder}
					</ScrollArea>
				)}
			</Droppable>
		</div>
	);
};

export default StatusColumn;
