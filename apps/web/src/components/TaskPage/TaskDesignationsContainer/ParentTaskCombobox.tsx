import { eventService, taskService } from "@/lib/services";
import { useEventStore, useTaskStore, useUserStore } from "@/store";
import { TODO } from "@squared/context";
import type { Task, TaskEvent } from "@squared/db";
import { useEffect, useState } from "react";
import { DesignationCombobox } from "./DesignationCombobox";

const ParentTaskCombobox = () => {
	const [open, setOpen] = useState(false);
	const { tasks, currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const user = useUserStore((state) => state.user);
	const { setEvents } = useEventStore((event) => event);
	const [parentTask, setParentTask] = useState<Task | null>(null);

	const taskId = currentTask?.id ?? "";
	const parentTaskTitle = parentTask?.title ?? "";
	const parentTaskId = parentTask?.id ?? "";

	useEffect(() => {
		const foundParent = tasks.find((t) => t.id === currentTask?.parentId);
		setParentTask(foundParent ?? null);
	}, [currentTask]);

	const handleAssignParentTask = async (parentId: string | null) => {
		const updatedTask = await taskService.updateTask(TODO, {
			id: taskId,
			updaterId: user?.id || "",
			parentId,
		});
		updateTask(updatedTask);
		setCurrentTask(updatedTask);

		const updatedEvents = await eventService.getTaskEvents(TODO, {
			taskId: taskId,
		});
		// TODO: Will remove type coercion once commits are implemented
		setEvents(updatedEvents as TaskEvent[]);
		setOpen(false);
	};

	if (!currentTask) return null;

	return (
		<>
			<DesignationCombobox
				open={open}
				setOpen={setOpen}
				triggerText={parentTaskTitle ? parentTaskTitle : "No parent assigned"}
				emptyText="No tasks found."
				listItems={tasks.filter((t) => t.id !== taskId)}
				selectedItemId={parentTaskId}
				selectedItemLabel={parentTaskTitle}
				itemLabel={(task: Task) => task.title}
				itemId={(task: Task) => task.id}
				onItemSelect={handleAssignParentTask}
			/>
		</>
	);
};

export default ParentTaskCombobox;
