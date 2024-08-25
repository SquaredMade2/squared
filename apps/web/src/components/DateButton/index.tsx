import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import format from "date-fns/format";
import axios from "axios";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { getSingleTask } from "@/store/task/thunks";
import { setDueDate } from "@/store/taskData";

const DateButton = ({ location }: { location: string }) => {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const taskId = useAppSelector((state) => state.singleTask?.data?._id);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const newIssueDate = useAppSelector(
		(state: RootState) => state.taskData.dueDate,
	);
	const sidebarDate: Date | undefined = useAppSelector((state) => {
		if (location === "issueSidebar") {
			return state.singleTask.data?.dueDate;
		}
		return undefined;
	});
	const initialDate = location === "issueSidebar" ? sidebarDate : newIssueDate;
	const initialTime = initialDate
		? format(new Date(initialDate), "HH:mm")
		: "12:00";
	const [selectedDate, setSelectedDate] = useState(initialDate ?? undefined);
	const [selectedTime, setSelectedTime] = useState(initialTime);

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
		if (location === "issueSidebar") updateItem(selectedDate);
		if (location === "newIssue") dispatch(setDueDate(selectedDate));
		setDropdownOpen(false);
	};

	const updateItem = async (newDate: Date | undefined) => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
				{ dueDate: newDate },
			);
			dispatch(getSingleTask(taskId as string));
		} catch (err) {
			toast({
				title: "Error",
				description: "Failed to update due date",
				variant: "destructive",
			});
		}
	};

	return (
		<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<PopoverTrigger
				asChild
				className={
					location === "newIssue"
						? "relative"
						: "relative flex flex-row flex-wrap"
				}
			>
				<Button
					variant="outline"
					className={`${"inline-flex items-center border border-border text-sm bg-popover hover:bg-muted dark:bg-muted dark:hover:bg-popover"} 
				${location === "newIssue" && "px-2 py-0.5 mr-3 text-popover-foreground shadow-md"} 
				${location === "issueSidebar" && "hover:border-border rounded-3xl px-3 py-1 m-1"}`}
				>
					<CalendarIcon className="size-4" />
					<span className="text-sm font-semibold text-popover-foreground ml-2 hover:cursor-pointer">
						{location === "issueSidebar" && sidebarDate
							? format(new Date(sidebarDate), "M/d/yy")
							: newIssueDate
								? format(new Date(newIssueDate), "M/d/yy")
								: "Due Date"}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 mr-4" side="left">
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
							title="title"
							type="time"
							className="flex items-center bg-accent p-3 rounded-lg flex-1 mt-2 h-10"
							value={selectedTime}
							onChange={handleSelectTime}
						/>
					</div>
					<div className="my-5 flex justify-end gap-3">
						<Button
							className="p-2.5 rounded-md text-primary-foreground bg-primary"
							onClick={() => setDropdownOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="p-2.5 rounded-md text-primary-foreground bg-primary"
							onClick={handleSave}
						>
							Save
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DateButton;
