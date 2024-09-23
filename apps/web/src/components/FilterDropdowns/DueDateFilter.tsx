"use client";

import { useEffect, useState } from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { FilterDropDownProps } from "./interfaces";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store";
import type { FilterCondition } from "@/store/filters";

const DueDateFilterDropDown = ({
	showFilterDropDown,
	setShowFilterDropDown,
}: FilterDropDownProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedToggle, setSelectedToggle] = useState<"before" | "after">(
		"before",
	);
	const { addFilter, currentFilterTypes } = useFilterStore((state) => state);

	const handleSelectDate = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	const handleToggleClick = (type: "before" | "after") => {
		setSelectedToggle(type);
	};

	const handleFilter = () => {
		if (selectedToggle && selectedDate) {
			const filterCondition: FilterCondition = {
				field: "dueDate",
				value: selectedDate.toISOString(),
				operator: selectedToggle === "before" ? "lessThan" : "greaterThan",
			};
			addFilter(filterCondition);
			setShowFilterDropDown(false);
		}
	};

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("dueDate")
		) {
			setSelectedDate(undefined);
		}
	}, [currentFilterTypes]);

	return (
		<Popover open={showFilterDropDown} onOpenChange={setShowFilterDropDown}>
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
					onSelect={handleSelectDate}
					initialFocus
				/>
				<div className="mt-4 flex justify-end gap-2">
					<Button
						variant="outline"
						onClick={() => setShowFilterDropDown(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleFilter} disabled={!selectedDate}>
						Filter
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DueDateFilterDropDown;
