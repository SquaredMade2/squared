"use client";

import { PriorityIcon } from "@/components/Icons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { priorityOptions } from "@/lib/constants";
import { eventService, taskService } from "@/lib/services";
import { useEventStore, useTaskStore, useUserStore } from "@/store";
import { formatPriority } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { Priority, TaskEvent } from "@squared/db";

const PriorityDropdown = () => {
	const { toast } = useToast();
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);
	const user = useUserStore((state) => state.user);
	const { setEvents } = useEventStore((state) => state);

	if (!currentTask) return null;

	const { priority: sidebarPriority, id: taskId } = currentTask;

	const handleSelectPriority = (newPriority: Priority) => {
		if (newPriority === sidebarPriority || !taskId) return;
		updateItem(newPriority);
	};

	const updateItem = async (newPriority: Priority) => {
		try {
			updateTask(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: user?.id || "",
					priority: newPriority,
				}),
			);
			setCurrentTask({ ...currentTask, priority: newPriority });

			const updatedEvents = await eventService.getTaskEvents(TODO, {
				taskId: taskId,
			});
			// TODO: Will remove type coercion once commits are implemented
			setEvents(updatedEvents as TaskEvent[]);
		} catch {
			toast({
				title: "Error updating priority",
				variant: "destructive",
			});
		}
	};

	return (
		<Select
			onValueChange={(value) => handleSelectPriority(value as Priority)}
			value={sidebarPriority}
		>
			<SelectTrigger className="md:grow flex flex-row items-center border-[0.8px] border-border text-card-foreground hover:cursor-pointer bg-transparent w-fit h-8 md:h-10">
				<SelectValue placeholder="Select priority">
					<div className="w-full flex items-center justify-between">
						<div className="w-4 h-4 mr-2">
							{sidebarPriority && <PriorityIcon priority={sidebarPriority} />}
						</div>
						<span className="text-sm font-semibold text-card-foreground">
							{sidebarPriority
								? formatPriority(sidebarPriority)
								: "Select priority"}
						</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{priorityOptions.map((priority) => (
					<SelectItem key={priority} value={priority}>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								<PriorityIcon priority={priority} />
								<span className="ml-2">{formatPriority(priority)}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default PriorityDropdown;
