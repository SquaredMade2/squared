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
	console.log(activeSprint);

	const { mutate: updateSprint } = useMutation({
		mutationKey: ["task", "updateSprint", task.id],
		mutationFn: async (sprintId: string) => {
			await client.sprint.addSprintTasks.$post({
				sprintId,
				taskIds: [task.id],
			});
			const res = await client.task.updateSprint.$post({
				taskId: task.id,
				sprintId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
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
		onSuccess: (updatedTask) => {
			toast({
				title: "Task added to sprint",
				description: `${updatedTask.title} has been added to the active sprint.`,
				variant: "default",
			});
		},
	});

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>Add to Sprint</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{!loading && activeSprint?.id ? (
					<ContextMenuItem onClick={() => updateSprint(activeSprint.id)}>
						{activeSprint?.name}
					</ContextMenuItem>
				) : (
					<ContextMenuItem>Loading...</ContextMenuItem>
				)}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default SprintSubContextMenu;

// disable when team.sprintsEnabled is false
//if no active sprint - none
// active sprint - add to ${sprintName}
