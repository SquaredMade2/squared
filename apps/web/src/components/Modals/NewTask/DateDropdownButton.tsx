"use client";

import { Calendar as CalendarIcon } from "@squared/icons";
import { format } from "date-fns";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useModalStore } from "@/store";
import { cn } from "@/utils/cn";
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
		<Popover>
			<PopoverTrigger asChild>
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
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
