import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { setCurrentFilter } from "@/store/filterPage/actions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	addMonths,
	subMonths,
	startOfWeek,
	endOfWeek,
	isSameMonth,
	isSameDay,
	startOfDay,
	isBefore,
	endOfDay,
} from "date-fns";
import type {
	DueDateFilterDropDownProps,
	FilterOption,
} from "@/app/interfaces/Filter.interfaces";
import { DAYS_OF_WEEK } from "@/constants/app_constants";

const DueDateFilterDropDown = ({
	showDueDateFilterDropDown,
	setShowDueDateFilterDropDown,
	handleFilter,
}: DueDateFilterDropDownProps) => {
	const dispatch = useAppDispatch();
	const [showFilterDropDown, setShowFilterDropDown] = useState(false);
	const filterDropDownRef = useRef<HTMLButtonElement | null>(null);
	const initialDate = new Date();
	const initialTime = initialDate
		? format(new Date(initialDate), "HH:mm")
		: "12:00";
	const [selectedTime, setSelectedTime] = useState(initialTime);
	const [selectedDate, setSelectedDate] = useState(
		initialDate ? new Date(initialDate) : new Date(),
	);
	const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
	const [selectedToggle, setSelectedToggle] = useState<
		"before" | "after" | null
	>(null);

	const isDateInPast = (date: Date) => isBefore(endOfDay(date), new Date());

	const updateDateTime = (date: Date, time: string) => {
		const [hours, minutes] = time.split(":").map(Number);
		const updatedDateTime = new Date(date);
		updatedDateTime.setHours(hours, minutes);
		setSelectedDate(updatedDateTime);
		setSelectedTime(time);
	};

	const handleSelectDate = (selectedDay: Date) => {
		if (isDateInPast(selectedDay)) return;
		updateDateTime(selectedDay, selectedTime);
	};

	const handleSelectTime = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = e.target.value;
		updateDateTime(selectedDate, time);
	};

	const handleClick = () => {
		if (selectedDate) {
			const filterOption: FilterOption = {
				id: 4,
				name: selectedDate.toISOString(),
				border: false,
				svg: {},
				group: "dueDate",
				comparison: selectedToggle,
			};
			handleFilter(filterOption);
			setShowFilterDropDown(false);
			setShowDueDateFilterDropDown(false);

			dispatch(setCurrentFilter(filterOption));
		}
	};

	const handleToggleClick = (type: "before" | "after") => {
		if (selectedToggle === type) {
			setSelectedToggle(null);
		} else {
			setSelectedToggle(type);
		}
	};

	const handleClickAway = () => {
		setShowFilterDropDown(false);
	};

	useEffect(() => {
		if (showDueDateFilterDropDown) {
			setShowFilterDropDown(true);
			if (filterDropDownRef.current) {
				filterDropDownRef.current.click();
			}
		} else {
			setShowFilterDropDown(false);
		}
	}, [showDueDateFilterDropDown]);

	const days = eachDayOfInterval({
		start: startOfWeek(startOfMonth(currentMonth)),
		end: endOfWeek(endOfMonth(currentMonth)),
	});

	const toggleButtonClass = (type: "before" | "after") =>
		`flex-1 p-2 rounded-md text-center cursor-pointer ${
			selectedToggle === type
				? "bg-[#123abc] text-foreground"
				: "bg-gray-400 text-foreground"
		}`;

	return (
		<div
			className={`absolute z-50 top-5 -left-1 w-72 transition-all duration-300 ${
				showFilterDropDown ? "h-10 mt-[20%] opacity-100" : "h-0 hidden"
			}`}
		>
			<div className="border border-border bg-popover p-3.5 text-sm shadow-lg rounded-md w-72">
				<div className="flex gap-2 mb-4">
					<div
						className={toggleButtonClass("before")}
						onClick={() => handleToggleClick("before")}
					>
						Before Date
					</div>
					<div
						className={toggleButtonClass("after")}
						onClick={() => handleToggleClick("after")}
					>
						After Date
					</div>
				</div>
				<div className="flex justify-between items-center text-foreground mb-4">
					<button
						onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
						type="button"
					>
						<ChevronLeft className="cursor-pointer size-5 text-[#6b6f76]" />
					</button>
					<span>{format(currentMonth, "MMMM yyyy")}</span>
					<button
						onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
						type="button"
					>
						<ChevronRight className="cursor-pointer size-5 text-[#6b6f76]" />
					</button>
				</div>
				<div className="grid grid-cols-7 gap-1 rounded-md py-3 my-3 bg-accent">
					{DAYS_OF_WEEK.map((dayName) => (
						<div
							key={dayName}
							className="font-semibold text-muted-foreground text-center"
						>
							{dayName.charAt(0)}
						</div>
					))}
				</div>
				<div className="grid grid-cols-7 gap-1">
					{days.map((day) => {
						const isPast = isDateInPast(day);
						const isSelected =
							selectedDate &&
							isSameDay(day, startOfDay(new Date(selectedDate)));
						return (
							<button
								key={day.toString()}
								className={`cursor-pointer rounded-md p-2 hover:bg-blueGlow border border-transparent hover:border-blueGlow text-center focus:outline-none focus:shadow-sm active:shadow-lg ${
									!isSameMonth(day, currentMonth)
										? "text-muted-foreground"
										: "text-foreground"
								} ${isSelected ? "text-[#174EFF] hover:bg-blueGlow" : ""} ${
									isPast
										? "cursor-not-allowed pointer-events-none text-muted-foreground"
										: ""
								}`}
								onClick={() => handleSelectDate(day)}
								disabled={isPast}
								type="button"
							>
								{format(day, "d")}
							</button>
						);
					})}
				</div>
				<div className="mt-4 flex flex-col text-foreground">
					Due date
					<div className="flex items-center justify-between gap-3 w-full">
						{selectedDate && (
							<span className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10">
								{format(new Date(selectedDate), "M/dd/yy")}
							</span>
						)}
						<input
							type="time"
							className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10"
							value={selectedTime}
							onChange={handleSelectTime}
						/>
					</div>
				</div>
				<div className="mt-10 flex justify-end gap-3">
					<button
						className="cursor-pointer p-2.5 rounded-md text-foreground border-2 border-border bg-popover"
						onClick={handleClickAway}
						type="button"
					>
						Cancel
					</button>
					<button
						className="cursor-pointer p-2.5 rounded-md text-foreground bg-[#123abc]"
						onClick={handleClick}
						type="button"
					>
						Filter
					</button>
				</div>
			</div>
		</div>
	);
};

export default DueDateFilterDropDown;
