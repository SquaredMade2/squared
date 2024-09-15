"use client";
import { useState, type FC } from "react";
import { Calendar } from "lucide-react";
import type { DateSubContextMenuProps } from "./interfaces";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
// import DateDropdown from "../DateDropdown";

const DateSubContextMenu: FC<DateSubContextMenuProps> = ({ task }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<ContextMenuSub open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<Calendar className="cursor-pointer size-4" />
				</div>
				Set due date...
			</ContextMenuSubTrigger>
			{/* <ContextMenuSubContent>
				<DateDropdown
					location={"contextMenu"}
					setDropdownOpen={setDropdownOpen}
					injectedTaskId={task.id}
				/>
			</ContextMenuSubContent> */}
		</ContextMenuSub>
	);
};

export default DateSubContextMenu;
