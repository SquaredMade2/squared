import { StatusIcon } from "@/components/Icons";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { statusOptions } from "@/constants/designations";
import { useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import type { Status } from "@squared/db";
import type { ContextMenuProps } from "./interfaces";

const StatusSubContextMenu = ({ task }: ContextMenuProps) => {
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

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<StatusIcon status={task.status} />
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
							<div className="mr-2">
								<StatusIcon status={status} />
							</div>
							{formatStatus(status)}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default StatusSubContextMenu;
