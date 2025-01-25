"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useFilterStore } from "@/store";
import type { FilterCondition } from "@/store/filters";
import { useEffect, useState } from "react";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import type { FilterOption } from "./interfaces";

const DueDateFilterDropDown = ({
	filterOption,
}: { filterOption: FilterOption }) => {
	const [open, setOpen] = useState(false);
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
		<DropdownMenuSub open={open} onOpenChange={setOpen}>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-70">
				<div className="flex gap-2 my-2 w-full justify-center">
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
				<div className="my-2 mr-2 flex justify-end gap-2">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleFilter} disabled={!selectedDate}>
						Filter
					</Button>
				</div>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};

export default DueDateFilterDropDown;
