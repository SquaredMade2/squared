import axios from "axios";
import { StatusSubContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import { inProgress } from "../Svg";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getSingleTask } from "@/store/task/thunks";
import { statusOptions } from "@/constants/designations";
import { getAllTasks } from "@/store/taskData/thunks";
import { toast } from "react-toastify";
import {
	Calendar,
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleX,
	Copy,
} from "lucide-react";
import { useState } from "react";
import DateDropdown from "../DateDropdown";

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const DateSubContextMenu: React.FC<StatusSubContextMenuProps> = ({ task }) => {
	const [showDropdown, setShowDropdown] = useState(true);

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const dispatch = useAppDispatch();

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
