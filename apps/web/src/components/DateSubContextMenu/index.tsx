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

const DateSubContextMenu: React.FC<StatusSubContextMenuProps> = ({
	task,
}) => {
	const [showDropdown, setShowDropdown] = useState(true);

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const dispatch = useAppDispatch();
	const handleSetStatus: (status: string) => void = async (status) => {
		if (status === "Duplicate") {
			toast("Duplicate is currently not implemented");
			return;
		}
		if (task._id !== undefined) {
			try {
				await axios.put(
					`${process.env.NEXT_PUBLIC_SERVER}/task/update/${task._id}`,
					{
						status,
					},
				);
				dispatch(getSingleTask(task._id as string));
				dispatch(getAllTasks(currentTeam));
			} catch (err) {
				console.error(err);
			}
		}
	};

	const handleButtonClick = () => {
		setShowDropdown(!showDropdown);
	};

	const handleClickAway = () => {
		setShowDropdown(!showDropdown);
	};

	const handleRenderIcon = (status: string) => {
		switch (status) {
			case "Backlog":
				return <CircleDashed className="size-4" />;
			case "Todo":
				return <Circle className="size-4" />;
			case "In Progress":
				return inProgress();
			case "Done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
			case "Canceled":
				return <CircleX className="size-4" />;
			case "Duplicate":
				return <Copy className="size-4" />;
			default:
				return null;
		}
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
