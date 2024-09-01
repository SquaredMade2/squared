import type { Comment } from "@repo/db";

export type CommentState = {
	comments: Comment[];
};

export type CommentActions = {
	addComment: (comment: Comment) => Promise<Comment>;
	updateComment: (
		commentId: string,
		comment: Partial<Comment>,
	) => Promise<Comment>;
	deleteComment: (commentId: string) => void;
	getComment: (commentId: string) => Promise<Comment | undefined>;
	getAllComments: (taskId: string) => Promise<Comment[]>;
};

export type CommentStore = CommentState & CommentActions;
