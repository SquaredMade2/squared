"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { useModalStore } from "@/store";
import { cn } from "@/utils/cn";
import { Button } from "@squared/ui/button";
import { Calendar } from "@squared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@squared/ui/popover";
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
