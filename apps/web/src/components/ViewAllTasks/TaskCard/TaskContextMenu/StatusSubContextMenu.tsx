import { StatusIcon } from "@/components/Icons";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { statusOptions } from "@/constants/designations";
import { taskService } from "@/lib/services";
import { formatStatus } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { Status } from "@squared/db";
import type { ContextMenuProps } from "./interfaces";

const StatusSubContextMenu = ({ task }: ContextMenuProps) => {
	const { toast } = useToast();

	const handleSetStatus: (status: Status) => void = async (status) => {
		if (task.id !== undefined) {
			try {
				await taskService.updateTask(TODO, { id: task.id, status });
			} catch (err) {
				toast({
					title: "Error updating task",
					description: err instanceof Error && err.message,
				});
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
