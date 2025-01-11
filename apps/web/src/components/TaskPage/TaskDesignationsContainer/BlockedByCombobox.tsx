import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import type { Task } from "@squared/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DesignationComboboxMany } from "./DesignationComboboxMany";

const BlockedByCombobox = () => {
	const [open, setOpen] = useState(false);
	const {
		tasks,
		currentTask,
		blockedByTasks,
		setBlockedByTasks,
	} = useTaskStore((state) => state);
	const user = useUserStore((state) => state.user);
	const queryClient = useQueryClient();

	const taskId = currentTask?.id;

	if (!currentTask || !taskId) return null;

	const updateTaskMutation = useMutation({
		mutationFn: async (blockingId: string) => {
			if (!user) throw new Error("User not found");
			const res = await client.task.updateBlockedTasks.$post({
				taskId,
				blockingTaskIds: blockedByTasks.find(t => t.id === blockingId) ? [...blockedByTasks.filter(t => t.id !== blockingId).map(t => t.id)] : [...blockedByTasks.map(t => t.id), blockingId],
			});
			return res.json();
		},
		onSuccess: (blockedTasks) => {
      setBlockedByTasks(blockedTasks);
			queryClient.invalidateQueries({ queryKey: ["taskEvents", taskId] });
		},
		retry: !!taskId
	});

	const handleUpdateBlockedByTasks = (taskId: string) => {
		updateTaskMutation.mutate(taskId);
	};

	

	return (
		<DesignationComboboxMany
			open={open}
			setOpen={setOpen}
			triggerText={"Add / Remove"}
			emptyText="No tasks found."
			listItems={tasks?.filter((t: Task) => t.id !== taskId) ?? []}
			selectedItemIds={blockedByTasks.map((task) => task.id)}
			itemLabel={(task: Task) => task.title}
			itemId={(task: Task) => task.id}
			onItemSelect={handleUpdateBlockedByTasks}
		/>
	);
};

export default BlockedByCombobox;
