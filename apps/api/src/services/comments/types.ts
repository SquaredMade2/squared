import type { Comment } from "@squaredmade/db";

export interface CommentRpc {
	addComment(comment: Omit<Comment, "id" | "date">): Promise<Comment[]>;
	deleteComment({ commentId }: { commentId: string }): Promise<void>;
	getTaskComments({ taskId }: { taskId: string }): Promise<Comment[]>;
}
