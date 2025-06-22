"use client";

import { Calendar as CalendarIcon } from "@squaredmade/icons";
import { Calendar } from "@squaredmade/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import type { ContextMenuProps } from "./interfaces";

const DateSubContextMenu = ({ task }: ContextMenuProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { updateTask } = useTaskStore((state) => state);

	const { mutate: updateDueDate } = useMutation({
		mutationFn: async (date?: Date) => {
			const res = await client.task.updateDueDate.$post({
				dueDate: date ?? null,
				taskId: task.id,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
		mutationKey: ["task", "updateDueDate", task.id],
	});

	const handleUpdate = (date?: Date) => {
		updateDueDate(date);
	};

	return (
		<ContextMenuSub onOpenChange={setDropdownOpen} open={dropdownOpen}>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<CalendarIcon className="size-4 cursor-pointer" />
				</div>
				Set due date...
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<Calendar
					initialFocus
					mode="single"
					onSelect={handleUpdate}
					selected={task.dueDate ?? undefined}
				/>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default DateSubContextMenu;
