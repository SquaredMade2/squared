"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const DesignationsDatePicker = () => {
	const { toast } = useToast();
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
			toast({
				title: "Success",
				description: "Due date updated successfully",
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to update due date",
				variant: "destructive",
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
