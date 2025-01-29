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
			className={isListView ? "mb-2 w-full" : "pb-2 pr-2 w-72 flex-shrink-0"}
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
								? "flex flex-col z-30 w-full gap-2 items-start"
								: "grid grid-rows-[1fr 9fr] rounded-lg bg-card w-72 h-[calc(100vh-250px)] mb-2 flex-grow transition-all duration-500 ease-in-out",
							dropSnapshot.isDraggingOver && "bg-[#242d42]",
						)}
					>
						<div className="w-full overflow-auto scrollbar-thin scrollbar-thumb-[#DBE0E3] dark:scrollbar-thumb-[#2C2C3B] dark:scrollbar-[#2C2C3B] scrollbar-track-transparent dark:scrollbar-track-transparent">
							<div
								className={cn(
									"w-full grow",
									isListView ? "flex flex-col" : "inline-flex",
								)}
							>
								<div
									ref={dropProvided.innerRef}
									{...dropProvided.droppableProps}
									className="flex flex-col items-start w-full min-h-[60px]"
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
