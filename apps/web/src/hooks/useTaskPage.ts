import { Status, type Task } from "@repo/db";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { useStore } from "./useStore";

export function useTaskPage(filterTasks: (tasks: Task[]) => Task[]) {
	const { tasks, updateTask } = useStore();

	const handleDragEnd: OnDragEndResponder = async ({
		destination,
		source,
		draggableId,
	}) => {
		if (!destination || destination.droppableId === source.droppableId) return;

		const draggedTask = tasks.find((task) => task.id === draggableId);
		if (!draggedTask) return;

		const updatedTask = {
			...draggedTask,
			status: destination.droppableId as Status,
		};
		await updateTask(updatedTask.id, { status: updatedTask.status });
	};

	const titleArr: { value: Status; id: number }[] = [
		{ value: Status.backlog, id: 1 },
		{ value: Status.todo, id: 2 },
		{ value: Status.inProgress, id: 3 },
		{ value: Status.inReview, id: 4 },
		{ value: Status.done, id: 5 },
	];

	const getFilteredStatuses = () => {
		return titleArr.map((t) => t.value);
	};

	const getTasksForStatus = (status: Status) => {
		return filterTasks(tasks).filter((task) => task.status === status);
	};

	return {
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	};
}
