"use client";

import { useState, type FC } from "react";
import { Calendar } from "lucide-react";
import type { DateSubContextMenuProps } from "@/components/TaskContextMenu/ContextMenu.interfaces";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import DateDropdown from "../DateDropdown";

const DateSubContextMenu: FC<DateSubContextMenuProps> = ({ task }) => {
	const [showDropdown, setShowDropdown] = useState(true);

	const handleButtonClick = () => {
		setShowDropdown(!showDropdown);
	};

	const handleClickAway = () => {
		setShowDropdown(!showDropdown);
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<Calendar className="cursor-pointer size-4" />
				</div>
				Set due date...
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<DateDropdown
					location={"contextMenu"}
					handleButtonClick={handleButtonClick}
					handleClickAway={handleClickAway}
					injectedTaskId={task._id}
				/>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default DateSubContextMenu;
