"use client";
import { Calendar } from "@/components/ui/calendar";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { taskService } from "@/lib/services";
import { TODO } from "@squared/context";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContextMenuProps } from "./interfaces";

const DateSubContextMenu = ({ task }: ContextMenuProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [date, setDate] = useState<Date>();
	useEffect(() => {
		if (date) {
			taskService.updateTask(TODO, { id: task.id, dueDate: date });
		}
	}, [date]);

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
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default DateSubContextMenu;
