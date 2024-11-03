"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

const DesignationsDatePicker = () => {
	const { toast } = useToast();
	const { updateTask, currentTask, setCurrentTask } = useTaskStore(
		(state) => state,
	);
	if (!currentTask) return null;
	const { id: taskId } = currentTask;

	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	useEffect(() => {
		setSelectedDate(
			currentTask?.dueDate ? new Date(currentTask.dueDate) : undefined,
		);
	}, [currentTask]);

	const handleSave = async () => {
		try {
			await updateTask(taskId, { dueDate: selectedDate });
			setCurrentTask({ ...currentTask, dueDate: selectedDate ?? null });
			toast({
				title: "Success",
				description: "Due date updated successfully",
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to update due date",
				variant: "destructive",
			});
		}
	};

	return (
		<DatePicker
			date={selectedDate}
			setDate={setSelectedDate}
			handleSubmit={handleSave}
		/>
	);
};

export default DesignationsDatePicker;
