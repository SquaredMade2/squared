"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { eventService, taskService } from "@/lib/services";
import { useEventStore, useTaskStore, useUserStore } from "@/store";
import { TODO } from "@squared/context";
import type { TaskEvent } from "@squared/db";
import { useEffect, useState } from "react";

const DesignationsDatePicker = () => {
	const { toast } = useToast();
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const { setEvents } = useEventStore((state) => state);
	const user = useUserStore((state) => state.user);
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
			updateTask(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: user?.id || "",
					dueDate: selectedDate === undefined ? null : selectedDate,
				}),
			);
			setCurrentTask({ ...currentTask, dueDate: selectedDate ?? null });
			const updatedEvents = await eventService.getTaskEvents(TODO, {
				taskId: taskId,
			});
			// TODO: Will remove type coercion once commits are implemented
			setEvents(updatedEvents as TaskEvent[]);
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
			date={selectedDate ? selectedDate : undefined}
			setDate={setSelectedDate}
			handleSubmit={handleSave}
		/>
	);
};

export default DesignationsDatePicker;
