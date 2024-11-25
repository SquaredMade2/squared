import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
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
import { buttonVariants } from "../ui/button";
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
	const { deleteTask } = useTaskStore((state) => state);
	const { toast } = useToast();
	const handleDelete = async () => {
		try {
			await taskService.deleteTask(TODO, { taskId: task.id });
			deleteTask(task.id);
			toast({
				title: "Task Deleted",
				description: `${task.title} has been successfully deleted.`,
			});
		} catch (error) {
			toast({
				title: "Error deleting task",
				description: parseError(error),
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
					<AlertDialogAction
						className={buttonVariants({ variant: "destructive" })}
						onClick={handleDelete}
					>
						Delete Task
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
