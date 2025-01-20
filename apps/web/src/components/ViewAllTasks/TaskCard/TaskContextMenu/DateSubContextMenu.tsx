"use client";

import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { Calendar } from "@squaredmade/ui/calendar";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@squaredmade/ui/context-menu";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { ContextMenuProps } from "./interfaces";

const DateSubContextMenu = ({ task }: ContextMenuProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { updateTask } = useTaskStore((state) => state);

	const { mutate: updateDueDate } = useMutation({
		mutationKey: ["updateTaskDueDate", task.id],
		mutationFn: async (date?: Date) => {
			const res = await client.task.updateDueDate.$post({
				taskId: task.id,
				dueDate: date ?? null,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
	});

	const handleUpdate = (date?: Date) => {
		updateDueDate(date);
	};

	return (
		<ContextMenuSub open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<CalendarIcon className="cursor-pointer size-4" />
				</div>
				Set due date...
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<Calendar
					mode="single"
					selected={task.dueDate ?? undefined}
					onSelect={handleUpdate}
					initialFocus
				/>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default DateSubContextMenu;
