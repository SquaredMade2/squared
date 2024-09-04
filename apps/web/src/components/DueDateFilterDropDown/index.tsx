import { useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Calendar as CalendarIcon,
} from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, isAfter, addMonths, subMonths } from "date-fns";
import type { DueDateFilterDropDownProps } from "@/app/interfaces/Filter.interfaces";
import { Button } from "@/components/ui/button";
import { useViewsStore } from "@/storeZ/provider"; // Adjust this import as needed
import type { FilterCondition } from "@/storeZ/views";

const DueDateFilterDropDown = ({
	showDueDateFilterDropDown,
	setShowDueDateFilterDropDown,
}: DueDateFilterDropDownProps) => {
	const { addFilter } = useViewsStore().getState();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedToggle, setSelectedToggle] = useState<
		"before" | "after" | null
	>(null);

	const handleSelectDate = (date: Date) => {
		if (selectedToggle && date) {
			const filterCondition: FilterCondition = {
				field: "dueDate",
				value: date.toISOString(),
				operator: selectedToggle === "before" ? "lessThan" : "greaterThan",
			};
			addFilter(filterCondition);
			setShowDueDateFilterDropDown(false);
		}
	};

	const handleToggleClick = (type: "before" | "after") => {
		setSelectedToggle(type === selectedToggle ? null : type);
	};

	const toggleButtonClass = (type: "before" | "after") =>
		`flex-1 p-2 rounded-md text-center cursor-pointer ${
			selectedToggle === type
				? "bg-[#123abc] text-foreground"
				: "bg-gray-400 text-foreground"
		}`;

	return (
		<Popover
			open={showDueDateFilterDropDown}
			onOpenChange={setShowDueDateFilterDropDown}
		>
			<PopoverTrigger asChild>
				<Button variant="outline" className="w-full justify-start">
					<CalendarIcon className="mr-2 h-4 w-4" />
					{selectedDate ? (
						format(selectedDate, "PPP")
					) : (
						<span>Pick a due date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-4">
				<div className="flex gap-2 mb-4">
					<Button
						variant="secondary"
						className={toggleButtonClass("before")}
						onClick={() => handleToggleClick("before")}
					>
						Before Date
					</Button>
					<Button
						variant="secondary"
						className={toggleButtonClass("after")}
						onClick={() => handleToggleClick("after")}
					>
						After Date
					</Button>
				</div>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => {
						setSelectedDate(date);
						handleSelectDate(date as Date);
					}}
					initialFocus
				/>
				<div className="mt-4 flex justify-end gap-2">
					<Button
						variant="outline"
						onClick={() => setShowDueDateFilterDropDown(false)}
					>
						Cancel
					</Button>
					<Button onClick={() => handleSelectDate(selectedDate as Date)}>
						Filter
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DueDateFilterDropDown;
