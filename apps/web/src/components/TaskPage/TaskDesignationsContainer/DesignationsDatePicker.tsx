"use client";

import { useState } from "react";
import { useTaskStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import type { ButtonProps } from "./interfaces";

const DesignationsDatePicker = ({ currentTask }: ButtonProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const taskId = currentTask ? currentTask.id : "";
	const initialDate = currentTask?.dueDate
		? new Date(currentTask.dueDate)
		: undefined;
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		initialDate,
	);

	const handleSave = async () => {
		try {
			await updateTask(taskId, { dueDate: selectedDate });
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
