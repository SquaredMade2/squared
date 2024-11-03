import type { Comment } from "@squared/db";
import axios from "axios";
import { createStore } from "zustand/vanilla";
import type { ApiReturnType } from "../interfaces";
import type { CommentResponse, CommentState, CommentStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";
import { v4 as uuidv4 } from "uuid";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/comment/${path}`;

export const createCommentStore = (
	initState: CommentState = { comments: [] },
) => {
	return createStore<CommentStore>()((set, get) => ({
		...initState,
		addComment: async (comment: Partial<Comment>): Promise<CommentResponse> => {
			try {
				const response: { data: ApiReturnType<Comment> } = await axios.post(
					apiString(uuidv4()),
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
			updatedComment: Partial<Comment>,
		): Promise<CommentResponse> => {
			try {
				const { data: response }: { data: ApiReturnType<Comment> } =
					await axios.put(apiString(commentId), updatedComment);

				set((state) => ({
					comments: state.comments.map((c) =>
						c.id === commentId ? { ...c, ...response.data } : c,
					),
				}));

				return {
					comment: response.data,
					message: response.message,
					variant: response.variant,
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
				console.error("Error deleting comment:", error);
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
				const { data: response }: { data: ApiReturnType<Comment> } =
					await axios.get(apiString(commentId));
				const { data: comment, ...rest } = response;
				return { ...rest, comment };
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
				const { data: response }: { data: ApiReturnType<Comment[]> } =
					await axios.get(
						`${process.env.NEXT_PUBLIC_SERVER}/api/task/${taskId}/comment`,
					);
				const { data: comments } = response;
				if (!comments) {
					set({ comments: [] });
					return [];
				}
				set({ comments });
				return comments;
			} catch (error) {
				console.error("Error in getAllComments:", error);
				return [];
			}
		},
	}));
};
