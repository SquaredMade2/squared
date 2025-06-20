"use client";

import { useModalStore } from "@/store";
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
import * as React from "react";
import { useEffect } from "react";

export function DateDropdownButton() {
	const [date, setDate] = React.useState<Date>();
	const { setNewTaskData, newTaskData } = useModalStore((state) => state);
	useEffect(() => {
		if (date) {
			setNewTaskData({ ...newTaskData, dueDate: date });
		}
	}, [date]);

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild={true}>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-center text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" side="left">
				<Calendar mode="single" selected={date} onSelect={setDate} />
			</PopoverContent>
		</Popover>
	);
}
