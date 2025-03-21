import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { useSprints } from "@/hooks/useSprints";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import type { ContextMenuProps } from "./interfaces";

const SprintSubContextMenu = ({ task }: ContextMenuProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const { sprint: activeSprint, loading } = useSprints();

	const { mutate: updateSprint } = useMutation({
		mutationKey: ["task", "updateSprint", task.id],
		mutationFn: async (sprintId: string | null) => {
			const res = await client.task.updateSprint.$post({
				taskId: task.id,
				sprintId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			if (sprintId) {
				await client.sprint.addSprintTasks.$post({
					sprintId,
					taskIds: [task.id],
				});
			}
			return updatedTask;
		},
		onError: (error) => {
			toast({
				title: "Error updating task",
				description:
					error instanceof Error ? error.message : "An error occurred",
				variant: "destructive",
			});
		},
		onSuccess: (updatedTask, sprintId) => {
			toast({
				title: "Task updated",
				description: sprintId
					? `${updatedTask.title} has been added to the active sprint.`
					: `${updatedTask.title} has been removed from the active sprint.`,
				variant: "default",
			});
		},
	});

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>Sprint</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{!loading && activeSprint?.id ? (
					task.sprintId === null ? (
						<ContextMenuItem onClick={() => updateSprint(activeSprint.id)}>
							Add to {activeSprint?.name}
						</ContextMenuItem>
					) : (
						<ContextMenuItem onClick={() => updateSprint(null)}>
							Remove from {activeSprint.name}
						</ContextMenuItem>
					)
				) : (
					<ContextMenuItem>Loading...</ContextMenuItem>
				)}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default SprintSubContextMenu;
