"use client";

import type { Priority, TaskEvent } from "@squaredmade/db";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { PriorityIcon } from "@/components/Icons";
import { client } from "@/lib/client";
import { priorityOptions } from "@/lib/constants";
import { useEventStore, useTaskStore } from "@/store";
import { formatPriority } from "@/utils/formatting";

const PriorityDropdown = () => {
	const { currentTask, setCurrentTask } = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	const taskId = currentTask?.id;
	const sidebarPriority = currentTask?.priority;

	const { mutate: updatePriority } = useMutation({
		mutationKey: ["task", "updatePriority", taskId],
		mutationFn: async (newPriority: Priority) => {
			if (!(currentTask && taskId)) throw new Error("Task not found");
			const res = await client.task.updatePriority.$post({
				taskId,
				priority: newPriority,
			});
			const updatedTask = await res.json();
			setCurrentTask({ ...currentTask, priority: newPriority });

			const eventsRes = await client.event.getEvents.$get({
				taskId,
			});
			const updatedEvents = await eventsRes.json();
			setEvents(updatedEvents as TaskEvent[]);

			return updatedTask;
		},
		onError: (error) => {
			toast.error("Error updating priority", {
				description: error.message,
			});
		},
	});

	const handleSelectPriority = (newPriority: Priority) => {
		if (newPriority === sidebarPriority || !taskId) return;
		updatePriority(newPriority);
	};

	return (
		<Select
			onValueChange={(value) => handleSelectPriority(value as Priority)}
			value={sidebarPriority}
		>
			<SelectTrigger className="flex h-8 w-fit flex-row items-center border-[0.8px] border-border bg-transparent px-4 py-2 text-card-foreground hover:cursor-pointer md:h-10 md:grow">
				<SelectValue placeholder="Select priority">
					<div className="flex w-full items-center justify-between">
						<div className="mr-2 h-4 w-4">
							{sidebarPriority && <PriorityIcon priority={sidebarPriority} />}
						</div>
						<span className="font-semibold text-card-foreground text-sm">
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
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<PriorityIcon priority={priority} />
								<span>{formatPriority(priority)}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default PriorityDropdown;
