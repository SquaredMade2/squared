"use client";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { ContextMenuProps } from "./interfaces";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { Calendar } from "@/components/ui/calendar";
import { useTaskStore } from "@/store";

const DateSubContextMenu = ({ task }: ContextMenuProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [date, setDate] = useState<Date>();
	const { updateTask } = useTaskStore((state) => state);
	useEffect(() => {
		if (date) {
			updateTask(task.id, { dueDate: date });
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
