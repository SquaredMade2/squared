import { cn } from "@/utils/cn";
import type {
	DroppableProvided,
	DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { GridColumnNewTaskButton } from "../../Modals";
import type { GroupColumnProps } from "../interfaces";
import Group from "./Group";

const GroupColumn = ({
	group,
	tasks,
	currentView: view,
	showTasks,
}: GroupColumnProps) => {
	const isListView = view === "list";
	return (
		<div
			className={isListView ? "mb-2 w-full" : "w-72 flex-shrink-0 pr-2 pb-2"}
		>
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
								: "9fr] mb-2 grid h-[calc(100vh-250px)] w-72 flex-grow grid-rows-[1fr rounded-lg bg-card transition-all duration-500 ease-in-out",
							dropSnapshot.isDraggingOver && "bg-[#242d42]",
						)}
					>
						<div className="scrollbar-thin scrollbar-thumb-[#DBE0E3] dark:scrollbar-thumb-[#2C2C3B] dark:scrollbar-[#2C2C3B] scrollbar-track-transparent dark:scrollbar-track-transparent w-full overflow-auto">
							<div
								className={cn(
									"w-full grow",
									isListView ? "flex flex-col" : "inline-flex",
								)}
							>
								<div
									ref={dropProvided.innerRef}
									{...dropProvided.droppableProps}
									className="flex min-h-[60px] w-full flex-col items-start"
								>
									{showTasks && <Group tasks={tasks} isListView={isListView} />}
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
