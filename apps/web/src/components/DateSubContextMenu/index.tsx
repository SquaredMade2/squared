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

const StatusSubContextMenu: React.FC<StatusSubContextMenuProps> = ({
	task,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);

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
			{showDropdown && (
				<DateDropdown
					location={""}
					handleButtonClick={handleButtonClick}
					handleClickAway={handleClickAway}
				/>
			)}
		</ContextMenuSub>
	);
};

export default StatusSubContextMenu;
