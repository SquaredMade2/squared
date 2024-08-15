import { useState } from "react";
import { Calendar } from "lucide-react";
import { StatusSubContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import DateDropdown from "../DateDropdown";

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const DateSubContextMenu: React.FC<StatusSubContextMenuProps> = ({ task }) => {
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
				<div className={styles.centerIcon}>
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
