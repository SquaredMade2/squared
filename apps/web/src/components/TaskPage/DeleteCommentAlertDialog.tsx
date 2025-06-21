"use client";
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
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { client } from "@/lib/client";
import { useCommentStore } from "@/store";
import { parseError } from "@/utils/parseError";

export const DeleteCommentAlertDialog = ({
	commentId,
	showConfirmDelete,
	setShowConfirmDelete,
}: {
	commentId: string;
	showConfirmDelete: boolean;
	setShowConfirmDelete: Dispatch<SetStateAction<boolean>>;
}) => {
	const { comments, setComments } = useCommentStore((state) => state);

	const { mutate: deleteCommentFromTask } = useMutation({
		mutationFn: async (cId: string) => {
			if (!cId) {
				throw new Error("Comment ID is required");
			}
			return await client.comment.deleteComment.$post({ commentId: cId });
		},
		mutationKey: ["comment", "deleteComment"],
		onError: (error) => {
			toast.error("Error deleting comment", {
				description: parseError(error),
			});
		},
		onSuccess: () => {
			setComments(comments.filter((comment) => comment.id !== commentId));
			toast.success("Comment Deleted", {
				description: "Comment has been successfully deleted.",
			});
		},
	});

	return (
		<AlertDialog onOpenChange={setShowConfirmDelete} open={showConfirmDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Comment</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this comment?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({ variant: "destructive" })}
						onClick={() => deleteCommentFromTask(commentId)}
					>
						Delete Comment
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
