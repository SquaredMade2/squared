"use client";

import { Button } from "@squaredmade/ui/button";
import { Calendar } from "@squaredmade/ui/calendar";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useFilterStore } from "@/store";
import type { FilterCondition } from "@/store/filters";
import { formatDateForComparison } from "@/store/filters/helpers";
import type { FilterOption } from "./interfaces";

const DueDateFilterDropDown = ({
	filterOption,
}: {
	filterOption: FilterOption;
}) => {
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedToggle, setSelectedToggle] = useState<"before" | "after">(
		"before",
	);
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);

	const handleSelectDate = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	const handleToggleClick = (type: "before" | "after") => {
		setSelectedToggle(type);
	};

	const dueDateFilter = currentFilters.find(
		(filter) => filter.field === "dueDate",
	);

	const storedDueDateValue = dueDateFilter?.value
		? (dueDateFilter.value as string | undefined)
		: undefined;

	useEffect(() => {
		if (storedDueDateValue) {
			setSelectedDate(new Date(storedDueDateValue));
		} else {
			setSelectedDate(undefined);
		}
	}, [storedDueDateValue]);

	const handleFilter = () => {
		if (selectedToggle && selectedDate) {
			const filterCondition: FilterCondition = {
				field: "dueDate",
				operator: selectedToggle === "before" ? "lessThan" : "greaterThan",
				value: selectedDate.toISOString(),
			};
			addFilter(filterCondition);
			setOpen(false);
		}
	};

	const isSameDate =
		selectedDate &&
		storedDueDateValue &&
		formatDateForComparison(storedDueDateValue.toString()) ===
			formatDateForComparison(selectedDate.toISOString());

	const resetFilter = () => {
		if (isSameDate) {
			removeFilter("dueDate");
			setSelectedDate(undefined);
			setOpen(false);
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
		<DropdownMenuSub onOpenChange={setOpen} open={open}>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-70">
				<div className="my-2 flex w-full justify-center gap-2">
					<Button
						className={selectedToggle === "before" ? "hover:bg-accent" : ""}
						onClick={() => handleToggleClick("before")}
						variant={selectedToggle === "before" ? "secondary" : "ghost"}
					>
						Before Date
					</Button>
					<Button
						className={selectedToggle === "after" ? "hover:bg-accent" : ""}
						onClick={() => handleToggleClick("after")}
						variant={selectedToggle === "after" ? "secondary" : "ghost"}
					>
						After Date
					</Button>
				</div>
				<Calendar
					initialFocus
					mode="single"
					onSelect={handleSelectDate}
					selected={selectedDate}
				/>
				<div className="my-2 mr-2 flex justify-end gap-2">
					<Button onClick={() => setOpen(false)} variant="outline">
						Cancel
					</Button>
					{isSameDate ? (
						<Button onClick={resetFilter}>Clear</Button>
					) : (
						<Button disabled={!selectedDate} onClick={handleFilter}>
							Filter
						</Button>
					)}
				</div>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};

export default DueDateFilterDropDown;
