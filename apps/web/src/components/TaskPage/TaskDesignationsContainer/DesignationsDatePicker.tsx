"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import type { ButtonProps } from "./interfaces";

const DesignationsDatePicker = ({ currentTask }: ButtonProps) => {
	const { toast } = useToast();
	const { updateTask, tasks } = useTaskStore((state) => state);
	const [localTask, setLocalTask] = useState(currentTask);

	useEffect(() => {
		if (currentTask) {
			const updatedTask = tasks.find((task) => task.id === currentTask.id);
			setLocalTask(updatedTask || currentTask);
		}
	}, [currentTask, tasks]);

	const taskId = localTask ? localTask.id : "";
	const initialDate = localTask?.dueDate
		? new Date(localTask.dueDate)
		: undefined;
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		initialDate,
	);

	useEffect(() => {
		setSelectedDate(
			localTask?.dueDate ? new Date(localTask.dueDate) : undefined,
		);
	}, [localTask]);

	const handleSave = async () => {
		try {
			await updateTask(taskId, { dueDate: selectedDate });
			setLocalTask((prev) =>
				prev ? { ...prev, dueDate: selectedDate ?? null } : prev,
			);
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
