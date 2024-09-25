import type { ContextMenuProps } from "./interfaces";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { statusOptions } from "@/constants/designations";
import { useTaskStore } from "@/store";
import type { Status } from "@repo/db";
import { StatusIcon } from "@/components/Icons";

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
							{status}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default StatusSubContextMenu;
