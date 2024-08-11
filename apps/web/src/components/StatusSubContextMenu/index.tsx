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

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const StatusSubContextMenu: React.FC<StatusSubContextMenuProps> = ({
	task,
}) => {
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
                    <CircleDashed className="size-4" />
				</div>
				Status
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{statusOptions.map((status) => {
					return (
						<ContextMenuItem
							key={status}
							onClick={() => handleSetStatus(status)}
						>
							<div className={styles.centerIcon}>
								{handleRenderIcon(status)}
							</div>
							{status}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default StatusSubContextMenu;
