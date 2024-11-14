import type { Comment } from "@squared/db";

export interface CommentRpc {
	addComment({ comment }: { comment: Omit<Comment, "id"> }): Promise<Comment[]>;
	deleteComment({ commentId }: { commentId: string }): Promise<void>;
	getTaskComments({ taskId }: { taskId: string }): Promise<Comment[]>;
}
