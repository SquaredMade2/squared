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
import React from "react";
import { checkOverdueDate } from "@/utils/checkOverdueDate";

interface DatePickerProps {
	date: Date | undefined;
	setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
	handleSubmit: () => void;
	className?: string;
}

export function DatePicker({
	date,
	setDate,
	handleSubmit,
	className,
}: DatePickerProps) {
	const [dropdownOpen, setDropdownOpen] = React.useState(false);

	const handleSelectDate = (newDate: Date | undefined) => {
		if (newDate) {
			setDate(newDate);
		} else {
			setDate(undefined);
		}
	};

	const handleSave = () => {
		handleSubmit();
		setDropdownOpen(false);
	};

	return (
		<Popover onOpenChange={setDropdownOpen} open={dropdownOpen}>
			<PopoverTrigger asChild={true}>
				<Button
					className={cn(
						"inline-flex h-10 w-full items-center justify-start px-4 py-2 text-left font-normal",
						!date && "text-muted-foreground",
						date && checkOverdueDate(date) && "text-destructive",
						className,
					)}
					size="sm"
					variant="outline"
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "MMM dd, yyyy") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				<Calendar mode="single" onSelect={handleSelectDate} selected={date} />
				<div className="flex justify-end gap-2 border-border border-t p-3">
					<Button
						onClick={() => setDropdownOpen(false)}
						size="sm"
						variant="outline"
					>
						Cancel
					</Button>
					<Button onClick={handleSave} size="sm">
						Save
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
