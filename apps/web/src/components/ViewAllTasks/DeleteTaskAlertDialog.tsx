"use client";

import { client } from "@/lib/client";
import { useTaskStore, useTeamStore, useViewStore } from "@/store";
import { useOrganization } from "@clerk/nextjs";
import type { Task } from "@squaredmade/db";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
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
	const { organization } = useOrganization();
	const { team } = useTeamStore((state) => state);
	const router = useRouter();

	const { mutate: handleDelete } = useMutation({
		mutationKey: ["task", "deleteTask", task.id],
		mutationFn: async () => {
			await client.task.deleteTask.$post({
				taskId: task.id,
			});
		},
		onSuccess: () => {
			toast.success("Task Deleted", {
				description: `${task.title} has been successfully deleted.`,
			});
			deleteTask(task.id);
			if (redirectTask) {
				router.push(
					`${lastVisitedPage === "inbox" ? "/inbox" : `/${organization?.slug}/team/${team?.identifier}/${lastVisitedPage}`}`,
				);
			}
		},
		onError: (error) => {
			toast.error("Error deleting task", {
				description: error.message,
			});
		},
	});

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
						onClick={() => handleDelete()}
					>
						Delete Task
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
