import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import type { Task } from "@squared/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DesignationCombobox } from "./DesignationCombobox";

const ParentTaskCombobox = () => {
	const [open, setOpen] = useState(false);
	const { tasks, currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const user = useUserStore((state) => state.user);
	const queryClient = useQueryClient();

	const taskId = currentTask?.id ?? "";

	const { data: parentTask } = useQuery({
		queryKey: ["parentTask", currentTask?.parentId],
		queryFn: async () => {
			if (!currentTask?.parentId) return null;
			return tasks.find((t) => t.id === currentTask?.parentId);
		},
		enabled: !!currentTask?.parentId,
	});

	const updateTaskMutation = useMutation({
		mutationFn: async (parentId: string | null) => {
			if (!user) throw new Error("User not found");
			const res = await client.task.updateParent.$post({
				taskId: taskId,
				parentId,
			});
			return res.json();
		},
		onSuccess: (updatedTask) => {
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			queryClient.invalidateQueries({
				queryKey: ["parentTask", updatedTask.parentId],
			});
			queryClient.invalidateQueries({ queryKey: ["taskEvents", taskId] });
		},
	});

	const handleAssignParentTask = (parentId: string | null) => {
		updateTaskMutation.mutate(parentId);
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
