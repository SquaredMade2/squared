"use client";
import { client } from "@/lib/client";
import { useEventStore, useTaskStore } from "@/store";
import type { Task, TaskEvent } from "@squaredmade/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DesignationCombobox } from "./DesignationCombobox";

const ParentTaskCombobox = () => {
	const [open, setOpen] = useState(false);
	const { tasks, currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const { setEvents } = useEventStore((state) => state);

	if (!currentTask) return null;
	const queryClient = useQueryClient();

	const taskId = currentTask?.id ?? "";

	const { data: parentTask } = useQuery({
		queryKey: ["task", "parentTask", currentTask?.parentId],
		queryFn: async () => {
			if (!currentTask?.parentId) return null;
			return tasks.find((t) => t.id === currentTask?.parentId);
		},
		enabled: !!currentTask?.parentId,
	});

	const { mutate: updateTaskMutation } = useMutation({
		mutationKey: ["task", "updateParent", currentTask?.parentId],
		mutationFn: async (parentId: string | null) => {
			const res = await client.task.updateParent.$post({
				taskId,
				parentId,
			});
			const updatedTask = await res.json();
			return updatedTask;
		},
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
			open={open}
			setOpen={setOpen}
			triggerText={parentTask?.title ?? "No parent assigned"}
			emptyText="No tasks found."
			listItems={tasks?.filter((t: Task) => t.id !== taskId) ?? []}
			selectedItemId={parentTask?.id ?? ""}
			selectedItemLabel={parentTask?.title ?? ""}
			itemLabel={(task: Task) => task.title}
			itemId={(task: Task) => task.id}
			onItemSelect={handleAssignParentTask}
		/>
	);
};

export default ParentTaskCombobox;
