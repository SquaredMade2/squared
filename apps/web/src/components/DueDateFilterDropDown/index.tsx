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
import type { DueDateFilterDropDownProps } from "@/app/interfaces/Filter.interfaces";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/storeZ";
import type { FilterCondition } from "@/storeZ/filters";

const DueDateFilterDropDown = ({
	showDueDateFilterDropDown,
	setShowDueDateFilterDropDown,
}: DueDateFilterDropDownProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedToggle, setSelectedToggle] = useState<"before" | "after">(
		"before",
	);
	const { addFilter } = useFilterStore((state) => state);

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
		setSelectedToggle(type === "before" ? "before" : "after");
	};

	return (
		<Popover
			open={showDueDateFilterDropDown}
			onOpenChange={setShowDueDateFilterDropDown}
		>
			<PopoverTrigger>
				<div className="hidden" aria-hidden="true" />
			</PopoverTrigger>
			<PopoverContent className="w-auto p-4 mr-32 mt-5">
				<div className="flex gap-2 mb-4 w-full justify-center">
					<Button
						variant={selectedToggle === "before" ? "secondary" : "ghost"}
						className={selectedToggle === "before" ? "hover:bg-accent" : ""}
						onClick={() => handleToggleClick("before")}
					>
						Before Date
					</Button>
					<Button
						variant={selectedToggle === "after" ? "secondary" : "ghost"}
						className={selectedToggle === "after" ? "hover:bg-accent" : ""}
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
