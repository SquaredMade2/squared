import { createStore } from "zustand/vanilla";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { CommentState, CommentStore, CommentResponse } from "./interfaces";
import type { Comment } from "@squared/db";
import type { ApiReturnType } from "../interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/comment/${path}`;

export const createCommentStore = (
	initState: CommentState = { comments: [] },
) => {
	return createStore<CommentStore>()((set, get) => ({
		...initState,
		addComment: async (comment: Partial<Comment>): Promise<CommentResponse> => {
			try {
				const commentId = uuidv4();
				const response: { data: ApiReturnType<Comment> } = await axios.post(
					apiString(commentId),
					comment,
				);

				const { data: newComment, message, variant } = response.data;

				if (!newComment) {
					return { comment: null, message, variant };
				}

				const { comments } = get();
				set({ comments: [...comments, newComment] });

				return { comment: newComment, message, variant };
			} catch (error) {
				return {
					comment: null,
					message: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				};
			}
		},
		updateComment: async (
			commentId: string,
			comment: Partial<Comment>,
		): Promise<CommentResponse> => {
			try {
				const response: { data: ApiReturnType<Comment> } = await axios.put(
					apiString(commentId),
					comment,
				);
				const updatedComment = response.data.data;
				if (!updatedComment) {
					return {
						comment: null,
						message: response.data.message,
						variant: response.data.variant,
					};
				}

				set((state) => ({
					comments: state.comments.map((c) =>
						c.id === commentId ? updatedComment : c,
					),
				}));

				return {
					comment: updatedComment,
					message: response.data.message,
					variant: response.data.variant,
				};
			} catch (error) {
				return {
					comment: null,
					message: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				};
			}
		},
		deleteComment: async (commentId: string): Promise<void> => {
			try {
				await axios.delete(apiString(commentId));
				set((state) => ({
					comments: state.comments.filter((c) => c.id !== commentId),
				}));
			} catch (error) {
				console.error("Error in deleteComment:", error);
			}
		},
		getComment: async (commentId: string): Promise<CommentResponse> => {
			const { comments } = get();
			const existingComment = comments.find((c) => c.id === commentId);
			if (existingComment) {
				return {
					comment: existingComment,
					message: "Comment found",
					variant: "default",
				};
			}

			try {
				const response: { data: ApiReturnType<Comment> } = await axios.get(
					apiString(commentId),
				);
				return { ...response.data, comment: response.data.data };
			} catch (error) {
				return {
					comment: null,
					message: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				};
			}
		},
		getAllComments: async (taskId: string): Promise<Comment[]> => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/task/${taskId}/comment`,
				);
				const commentData: Comment[] = response.data.data;
				set({ comments: commentData });
				return commentData;
			} catch (error) {
				console.error("Error in getAllComments:", error);
				return [];
			}
		},
	}));
};
