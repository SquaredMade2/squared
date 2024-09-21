import type { FC } from "react";
import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
} from "lucide-react";
import type { StatusSubContextMenuProps } from "./interfaces";
import { inProgress } from "../Svg";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import { statusOptions } from "@/constants/designations";
import { useTaskStore } from "@/store";
import type { Status } from "@repo/db";

const StatusSubContextMenu: FC<StatusSubContextMenuProps> = ({ task }) => {
	const { updateTask } = useTaskStore((state) => state);

	const handleSetStatus: (status: Status) => void = async (status) => {
		if (task.id !== undefined) {
			try {
				await updateTask(task.id, {
					status,
				});
			} catch (err) {
				console.error(err);
			}
		}
	};

	const handleRenderIcon = (status: Status) => {
		switch (status) {
			case "backlog":
				return <CircleDashed className="size-4" />;
			case "todo":
				return <Circle className="size-4" />;
			case "inProgress":
				return inProgress();
			case "inReview":
				return <CircleFadingPlus className="size-4 text-green-400" />;
			case "done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
			default:
				return <CircleDashed className="size-4" />;
		}
	};
	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<CircleDashed className="size-4" />
				</div>
				Status
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{/* Need to get rid of the last item (Duplicate) because its not used yet */}
				{statusOptions.slice(0, -1).map((status) => {
					return (
						<ContextMenuItem
							key={status}
							onClick={() => handleSetStatus(status)}
						>
							<div className="mr-2">{handleRenderIcon(status)}</div>
							{status}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default StatusSubContextMenu;
