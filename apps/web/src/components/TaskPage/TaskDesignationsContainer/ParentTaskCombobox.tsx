"use client";
import type { Task, TaskEvent } from "@squaredmade/db";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { client } from "@/lib/client";
import { useEventStore, useTaskStore } from "@/store";
import { DesignationCombobox } from "./DesignationCombobox";

const ParentTaskCombobox = () => {
	const [open, setOpen] = useState(false);
	const { tasks, currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const { setEvents } = useEventStore((state) => state);

	const queryClient = useQueryClient();

	const taskId = currentTask?.id ?? "";

	const { data: parentTask } = useQuery({
		enabled: !!currentTask?.parentId,
		queryFn: () => {
			if (!currentTask?.parentId) return null;
			return tasks.find((t) => t.id === currentTask?.parentId);
		},
		queryKey: ["task", "parentTask", currentTask?.parentId],
	});

	const { mutate: updateTaskMutation } = useMutation({
		mutationFn: async (parentId: string | null) => {
			if (!(currentTask && taskId)) throw new Error("Task not found");
			const res = await client.task.updateParent.$post({
				parentId,
				taskId,
			});
			const updatedTask = await res.json();
			return updatedTask;
		},
		mutationKey: ["task", "updateParent", currentTask?.parentId],
		onError: (error) => {
			toast.error("Error updating parent id", {
				description: error.message,
			});
		},
		onSuccess: async (updatedTask) => {
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			const eventsRes = await client.event.getEvents.$get({
				taskId,
			});
			const updatedEvents = await eventsRes.json();
			setEvents(updatedEvents as TaskEvent[]);
			queryClient.invalidateQueries({
				queryKey: ["parentTask", updatedTask.parentId],
			});
		},
	});

	const handleAssignParentTask = (parentId: string | null) => {
		updateTaskMutation(parentId);
		setOpen(false);
	};

	if (!currentTask) return null;

	return (
		<DesignationCombobox
			emptyText="No tasks found."
			itemId={(task: Task) => task.id}
			itemLabel={(task: Task) => task.title}
			listItems={tasks?.filter((t: Task) => t.id !== taskId) ?? []}
			onItemSelect={handleAssignParentTask}
			open={open}
			selectedItemId={parentTask?.id ?? ""}
			selectedItemLabel={parentTask?.title ?? ""}
			setOpen={setOpen}
			triggerText={parentTask?.title ?? "No parent assigned"}
		/>
	);
};

export default ParentTaskCombobox;
