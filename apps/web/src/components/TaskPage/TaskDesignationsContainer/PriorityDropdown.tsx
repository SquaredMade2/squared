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
import { client } from "@/lib/client";
import { priorityOptions } from "@/lib/constants";
import { useEventStore, useTaskStore } from "@/store";
import { formatPriority } from "@/utils/formatting";
import type { Priority, TaskEvent } from "@squared/db";
import { useMutation } from "@tanstack/react-query";

const PriorityDropdown = () => {
	const { toast } = useToast();
	const { currentTask, setCurrentTask } = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	if (!currentTask) return null;

	const { priority: sidebarPriority, id: taskId } = currentTask;

	const { mutate: updatePriority } = useMutation({
		mutationKey: ["updateTaskPriority", taskId],
		mutationFn: async (newPriority: Priority) => {
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
			toast({
				title: "Error updating priority",
				description: error.message,
				variant: "destructive",
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
