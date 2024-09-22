import type { Comment } from "@repo/db";

export type CommentState = {
	comments: Comment[];
};

export interface CommentResponse {
	comment: Comment | null;
	message?: string;
	variant: "default" | "destructive";
}

type CommentActions = {
	addComment: (comment: Partial<Comment>) => Promise<CommentResponse>;
	updateComment: (
		commentId: string,
		comment: Partial<Comment>,
	) => Promise<CommentResponse>;
	deleteComment: (commentId: string) => Promise<void>;
	getComment: (commentId: string) => Promise<CommentResponse>;
	getAllComments: (taskId: string) => Promise<Comment[]>;
};

export type CommentStore = CommentState & CommentActions;
