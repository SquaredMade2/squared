"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const DesignationsDatePicker = () => {
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const user = useUserStore((state) => state.user);
	const queryClient = useQueryClient();

	if (!currentTask) return null;
	const { id: taskId } = currentTask;

	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	useEffect(() => {
		setSelectedDate(
			currentTask?.dueDate ? new Date(currentTask.dueDate) : undefined,
		);
	}, [currentTask]);

	const updateTaskMutation = useMutation({
		mutationFn: async (date: Date | null) => {
			if (!user) throw new Error("User not found");
			const res = await client.task.updateDueDate.$post({
				taskId: taskId,
				dueDate: date,
			});
			return res.json();
		},
		onSuccess: (updatedTask) => {
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			queryClient.invalidateQueries({
				queryKey: ["event", "taskEvents", taskId],
			});
			toast.success("Due date updated successfully");
		},
		onError: (error) => {
			toast.error("Error updating due date", {
				description:
					error instanceof Error ? error.message : "Failed to update due date",
			});
		},
	});

	return (
		<DatePicker
			date={selectedDate}
			setDate={setSelectedDate}
			handleSubmit={() => updateTaskMutation.mutate(selectedDate ?? null)}
		/>
	);
};

export default DesignationsDatePicker;
