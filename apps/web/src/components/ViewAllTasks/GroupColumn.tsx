import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskColumnTitle from "./TaskColumnTitle";
import type { StatusColumnProps } from "./interfaces";
import { ScrollArea } from "../ui/scroll-area";
import { GridColumnNewIssueButton } from "../NewIssue/NewIssueButton";
import TaskCard from "./TaskCard";
import type { Status } from "@repo/db";

const StatusColumn = ({
	columnType,
	title,
	tasks,
	currentView: view,
}: StatusColumnProps) => {
	const [showTasks, setShowTasks] = useState(true);
	const numberOfTasks = tasks.length;
	const isListView = view === "list";

	return (
		<div className={isListView ? "mb-2 w-full" : "pb-2 flex-grow"}>
			<TaskColumnTitle
				isListView={isListView}
				showTasks={showTasks}
				numberOfTasks={numberOfTasks}
				title={title}
				setShowTasks={setShowTasks}
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
						<div
							className={
								isListView
									? "grid grid-rows-[1fr 9fr] rounded-lg bg-card w-full"
									: "flex flex-col z-30 w-full min-h-[135px] pb-1 gap-2"
							}
						>
							{showTasks &&
								tasks.map((task, index) => (
									<TaskCard
										key={task.id}
										task={task}
										index={index}
										location={"dashboard"}
									/>
								))}
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
