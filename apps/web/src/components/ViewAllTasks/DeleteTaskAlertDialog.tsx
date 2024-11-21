import { taskService } from "@/lib/services";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
import type { Dispatch, SetStateAction } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export const DeleteTaskAlertDialog = ({
	task,
	showConfirmDelete,
	setShowConfirmDelete,
}: {
	task: Task;
	showConfirmDelete: boolean;
	setShowConfirmDelete: Dispatch<SetStateAction<boolean>>;
}) => {
	const { toast } = useToast();
	const deleteCurrentTask = async () => {
		try {
			await taskService.deleteTask(TODO, { taskId: task.id });
			toast({
				title: "Task Deleted",
				description: `${task.title} has been successfully deleted.`,
			});
		} catch (error) {
			toast({
				title: "Error deleting task",
				description: error instanceof Error && error.message,
			});
		}
	};

	return (
		<AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Task</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete "{task.title}"?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button variant="destructive" onClick={deleteCurrentTask}>
							Delete Task
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
