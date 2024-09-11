import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Task } from "@repo/db";

export interface DragResult {
	draggableId: string;
	source: {
		index: number;
		droppableId: string;
	};
	destination: {
		index: number;
		droppableId: string;
	};
}

export interface ViewAllTasksProps {
	tasks: Task[];
	activeSelected: boolean;
	backlogSelected: boolean;
	handleDragEnd: OnDragEndResponder;
}
