"use client";

import { Calendar as CalendarIcon } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { Calendar } from "@squaredmade/ui/calendar";
import { cn } from "@squaredmade/ui/cn";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store";

export function DateDropdownButton() {
	const [date, setDate] = useState<Date>();
	const { setNewTaskData, newTaskData } = useModalStore((state) => state);
	useEffect(() => {
		if (date) {
			setNewTaskData({ ...newTaskData, dueDate: date });
		}
	}, [date]);

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						"w-full justify-center text-left font-normal",
						!date && "text-muted-foreground",
					)}
					variant="outline"
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" side="left">
				<Calendar mode="single" onSelect={setDate} selected={date} />
			</PopoverContent>
		</Popover>
	);
}
