import { toast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import type { Task } from "@squaredmade/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DesignationComboboxMany } from "./DesignationComboboxMany";

const BlockedByCombobox = () => {
	const [open, setOpen] = useState(false);
	const {
		tasks,
		currentTask,
		currentTaskBlockedBy,
		currentTaskBlockingIds,
		setCurrentTaskBlockedBy,
	} = useTaskStore((state) => state);
	const queryClient = useQueryClient();

	const taskId = currentTask?.id;

	if (!currentTask || !taskId) return null;

	const { mutate: mutateUpdateBlockedByTasks } = useMutation({
		mutationFn: async (blockingId: string) => {
			if (currentTaskBlockingIds.includes(blockingId)) {
				toast({
					title: "You can't have two tasks blocking each other",
					variant: "destructive",
				});
				return currentTaskBlockedBy;
			}
			const res = await client.task.updateBlockedOrBlockingTasks.$post({
				taskId,
				key: "blockedBy",
				updatingIds: currentTaskBlockedBy.find((t) => t.id === blockingId)
					? [
							...currentTaskBlockedBy
								.filter((t) => t.id !== blockingId)
								.map((t) => t.id),
						]
					: [...currentTaskBlockedBy.map((t) => t.id), blockingId],
			});
			return res.json();
		},
		onSuccess: (blockedTasks) => {
			setCurrentTaskBlockedBy(blockedTasks);
			queryClient.invalidateQueries({ queryKey: ["event", taskId] });
		},
	});

	const handleUpdateBlockedByTasks = (taskId: string) => {
		mutateUpdateBlockedByTasks(taskId);
	};

	return (
		<DesignationComboboxMany
			open={open}
			setOpen={setOpen}
			triggerText={"Add / Remove"}
			emptyText="No tasks found."
			listItems={tasks?.filter((t: Task) => t.id !== taskId) ?? []}
			selectedItemIds={currentTaskBlockedBy.map((task) => task.id)}
			itemLabel={(task: Task) => task.title}
			itemId={(task: Task) => task.id}
			onItemSelect={handleUpdateBlockedByTasks}
		/>
	);
};

export default BlockedByCombobox;
