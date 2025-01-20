"use client";

import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { useTeamStore, useViewStore, useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@squaredmade/ui/alert-dialog";
import { buttonVariants } from "@squaredmade/ui/button";
import { useToast } from "@squaredmade/ui/hooks";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";

export const DeleteTaskAlertDialog = ({
	task,
	showConfirmDelete,
	setShowConfirmDelete,
	redirectTask,
}: {
	task: Task;
	showConfirmDelete: boolean;
	setShowConfirmDelete: Dispatch<SetStateAction<boolean>>;
	redirectTask?: boolean;
}) => {
	const { deleteTask } = useTaskStore((state) => state);
	const { lastVisitedPage } = useViewStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { team } = useTeamStore((state) => state);
	const { toast } = useToast();
	const router = useRouter();

	const handleDelete = async () => {
		try {
			await taskService.deleteTask(TODO, { taskId: task.id });

			toast({
				title: "Task Deleted",
				description: `${task.title} has been successfully deleted.`,
			});
			deleteTask(task.id);
			if (redirectTask) {
				router.push(
					`${lastVisitedPage === "inbox" ? "/inbox" : `/${workspace?.url}/team/${team?.identifier}/${lastVisitedPage}`}`,
				);
			}
		} catch (error) {
			toast({
				title: "Error deleting task",
				description: parseError(error),
				variant: "destructive",
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
