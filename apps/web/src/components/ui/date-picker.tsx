"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

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
		<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn(
						"inline-flex items-center justify-start w-full text-left font-normal h-10 px-4 py-2",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "MMM dd, yyyy") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelectDate}
					initialFocus
				/>
				<div className="flex justify-end gap-2 p-3 border-t border-border">
					<Button
						size="sm"
						variant="outline"
						onClick={() => setDropdownOpen(false)}
					>
						Cancel
					</Button>
					<Button size="sm" onClick={handleSave}>
						Save
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
