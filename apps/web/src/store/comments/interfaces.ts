import type { Comment } from "@squaredmade/db";

export type CommentState = {
	comments: Comment[];
};

export interface CommentResponse {
	comment: Comment | null;
	message?: string;
	variant: "default" | "destructive";
}

type CommentActions = {
	setComments: (comments: Comment[]) => void;
};

export type CommentStore = CommentState & CommentActions;
