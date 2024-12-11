"use client";
import { Calendar } from "@/components/ui/calendar";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { taskService } from "@/lib/services";
import { useTaskStore, useUserStore } from "@/store";
import { TODO } from "@squared/context";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { ContextMenuProps } from "./interfaces";

const DateSubContextMenu = ({ task }: ContextMenuProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const user = useUserStore((state) => state.user);
	const { updateTask } = useTaskStore((state) => state);
	const handleUpdate = async (date?: Date) => {
		updateTask(
			await taskService.updateTask(TODO, {
				id: task.id,
				updaterId: user?.id || "",
				dueDate: date,
			}),
		);
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
