"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTaskStore } from "@/store";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import type { ButtonProps } from "@/components/TaskDesignationsContainer/interfaces";

const DatePicker = ({ currentTask }: ButtonProps) => {
	const { toast } = useToast();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { updateTask } = useTaskStore((state) => state);
	const sidebarDate = currentTask?.dueDate;
	const taskId = currentTask ? currentTask.id : "";
	const initialDate = sidebarDate;
	const initialTime = initialDate
		? format(new Date(initialDate), "HH:mm")
		: "12:00";
	const [selectedTime, setSelectedTime] = useState(initialTime);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		initialDate ?? undefined,
	);

	const updateDateTime = (date: Date | undefined, time: string) => {
		if (date === undefined) return;
		const [hours, minutes] = time.split(":").map(Number);
		const updatedDateTime = new Date(date);
		updatedDateTime.setHours(hours, minutes);
		setSelectedDate(updatedDateTime);
		setSelectedTime(time);
	};

	const handleSelectDate = (selectedDay: Date | undefined) => {
		if (selectedDay === undefined) return;
		updateDateTime(selectedDay, selectedTime);
	};

	const handleSelectTime = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = e.target.value;
		updateDateTime(selectedDate, time);
	};

	const handleSave = () => {
		updateItem(selectedDate);
	};

	const updateItem = async (newDate: Date | undefined) => {
		try {
			await updateTask(taskId, { dueDate: newDate });
			// await getTaskEvents(taskId);
		} catch {
			toast({
				title: "Error",
				description: "Failed to update due date",
				variant: "destructive",
			});
		}
	};

	return (
		<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<PopoverTrigger asChild className="relative flex flex-row flex-wrap">
				<Button
					variant="outline"
					size="sm"
					className="inline-flex items-center bg-popover hover:bg-muted rounded-3xl px-3 py-1 m-1"
				>
					<CalendarIcon className="size-4" />
					<span className="text-sm font-semibold text-popover-foreground ml-2 hover:cursor-pointer">
						{sidebarDate ? format(new Date(sidebarDate), "M/d/yy") : "Due Date"}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="border border-border w-auto p-0 mr-4"
				side="left"
			>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => handleSelectDate(date)}
					disabled={(date) => date < new Date()}
					defaultMonth={selectedDate ? new Date(selectedDate) : new Date()}
				/>
				<div className="flex flex-col text-popover-foreground px-3 m-2">
					Due date
					<div className="flex items-center justify-between gap-3 w-full">
						<span className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10">
							{selectedDate
								? format(new Date(selectedDate), "M/dd/yy")
								: "M/dd/yy"}
						</span>
						<input
							title="Select time"
							type="time"
							className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10"
							value={selectedTime}
							onChange={handleSelectTime}
						/>
					</div>
					<div className="my-5 flex justify-end gap-3">
						<Button
							variant="outline"
							className="p-2.5 rounded-md"
							onClick={() => setDropdownOpen(false)}
						>
							Cancel
						</Button>
						<Button className="p-2.5 rounded-md" onClick={handleSave}>
							Save
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DatePicker;
