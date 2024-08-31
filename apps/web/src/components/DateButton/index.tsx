import { useState } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import { formatDate } from "date-fns/format";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import DateDropdown from "../DateDropdown";

const DateButton = ({ location }: { location: string }) => {
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
					size="sm"
					className={`${"inline-flex items-center bg-popover hover:bg-muted"} 
					${location === "newIssue" && "px-2 py-0.5 mr-3 shadow-md"} 
				${location === "issueSidebar" && "rounded-3xl px-3 py-1 m-1"}`}
				>
					<CalendarIcon className="size-4" />
					<span className="text-sm font-semibold text-popover-foreground ml-2 hover:cursor-pointer">
						{location === "issueSidebar" && sidebarDate
							? formatDate(new Date(sidebarDate), "M/d/yy")
							: newIssueDate
								? formatDate(new Date(newIssueDate), "M/d/yy")
								: "Due Date"}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="border border-border w-auto p-0 mr-4"
				side="left"
			>
				<DateDropdown
					location={location}
					setDropdownOpen={setDropdownOpen}
					injectedTaskId=""
				/>
			</PopoverContent>
		</Popover>
	);
};

export default DateButton;
