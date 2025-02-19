"use client";

import { client } from "@/lib/client";
import { useTaskStore, useTeamStore, useViewStore } from "@/store";
import { useOrganization } from "@clerk/nextjs";
import type { Task } from "@squared/db";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
	const { toast } = useToast();
	const router = useRouter();

	const { mutate: handleDelete } = useMutation({
		mutationKey: ["task", "deleteTask", task.id],
		mutationFn: async () => {
			await client.task.deleteTask.$post({
				taskId: task.id,
			});
		},
		onSuccess: () => {
			toast({
				title: "Task Deleted",
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
			toast({
				title: "Error deleting task",
				description: error.message,
				variant: "destructive",
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
