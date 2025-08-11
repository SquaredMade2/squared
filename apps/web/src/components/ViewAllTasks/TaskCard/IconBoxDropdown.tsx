import { Calendar, UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { formatDate } from "date-fns";
import type { ReactElement } from "react";
import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { checkOverdueDate } from "@/utils/checkOverdueDate";
import { formatName, getInitials } from "@/utils/formatting";
import type { IconBoxDropdownsProps } from "./interfaces";
import { AssigneeBox, DateBox, StatusBox } from "./quickEditBoxes";

const IconBoxDropdown = ({
	task,
	user,
	status,
	priority,
	avatar,
	userSearch,
	date,
}: IconBoxDropdownsProps) => {
	let iconBox: ReactElement | null = null;
	let dropDownBox: ReactElement | null = null;

	if (status) {
		iconBox = (
			<Button
				className="h-6 shrink-0 py-3 px-1 mr-1 border rounded-xl hover:border-white"
				variant="ghost"
			>
				<StatusIcon status={task.status} />
			</Button>
		);
		dropDownBox = (
			<>
				<DropdownMenuContent onClick={(e) => e.preventDefault()}>
					<StatusBox task={task} />
				</DropdownMenuContent>
				<TooltipContent>Status: {task.status}</TooltipContent>
			</>
		);
	} else if (priority) {
		iconBox = (
			<Button
				className="mb-1 mr-1 rounded-md border border-border p-1 hover:border-white h-7"
				variant="ghost"
			>
				<PriorityIcon priority={task.priority} />
			</Button>
		);
		dropDownBox = (
			<>
				<DropdownMenuContent onClick={(e) => e.preventDefault()}>
					<StatusBox task={task} />
				</DropdownMenuContent>
				<TooltipContent>Status: {task.status}</TooltipContent>
			</>
		);
	} else if (avatar) {
		iconBox = (
			<Avatar className="size-7 shrink-0 border-2 hover:border-white">
				<AvatarImage src={user?.imageUrl} />
				<AvatarFallback className="text-xxs">
					{getInitials(formatName(user))}
				</AvatarFallback>
			</Avatar>
		);
		dropDownBox = (
			<>
				<DropdownMenuContent onClick={(e) => e.preventDefault()}>
					<AssigneeBox task={task} />
				</DropdownMenuContent>
				<TooltipContent>{formatName(user)}</TooltipContent>
			</>
		);
	} else if (userSearch) {
		iconBox = (
			<Button
				className="border-2 hover:border-white rounded-3xl px-1 h-7"
				variant="ghost"
			>
				<UserSearch className="size-7 shrink-0 text-[#9597AD]" />
			</Button>
		);
		dropDownBox = (
			<>
				<DropdownMenuContent onClick={(e) => e.preventDefault()}>
					<AssigneeBox task={task} />
				</DropdownMenuContent>
				<TooltipContent>Assign task</TooltipContent>
			</>
		);
	} else if (date) {
		iconBox = (
			<Button
				className={cn(
					"xs:hidden shrink-0 whitespace-nowrap rounded-md border border-border p-1 sm:hidden md:flex hover:border-white text-sm gap-2 w-fit text-white",
					checkOverdueDate(task.dueDate) &&
						"border-destructive text-destructive",
				)}
				variant="ghost"
			>
				{" "}
				<Calendar className="size-4 mb-[3px]" />
				{task.dueDate
					? formatDate(new Date(task.dueDate), "MMM dd")
					: "No Date"}
			</Button>
		);
		dropDownBox = (
			<>
				<DropdownMenuContent onClick={(e) => e.preventDefault()}>
					<DateBox task={task} />
				</DropdownMenuContent>
				<TooltipContent>Due Date</TooltipContent>
			</>
		);
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<TooltipTrigger asChild>{iconBox}</TooltipTrigger>
					</DropdownMenuTrigger>
					{dropDownBox}
				</DropdownMenu>
			</Tooltip>
		</TooltipProvider>
	);
};

export default IconBoxDropdown;
