import type { Comment } from "@repo/db";

export type CommentState = {
	comments: Comment[];
};

export type CommentActions = {
	addComment: (comment: Comment) => (state: CommentState) => Promise<Comment>;
	updateComment: (
		commentId: string,
		comment: Partial<Comment>,
	) => (state: CommentState) => Promise<Comment>;
	deleteComment: (commentId: string) => (state: CommentState) => void;
	getComment: (
		commentId: string,
	) => (state: CommentState) => Promise<Comment | undefined>;
	getAllComments: (
		taskId: string,
	) => (state: CommentState) => Promise<Comment[]>;
};

export type CommentStore = CommentState & CommentActions;
