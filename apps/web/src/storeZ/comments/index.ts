import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { CommentState, CommentStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { Comment } from "@repo/db";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/comment/${path}`;

export const createCommentStore = (
	initState: CommentState = { comments: [] },
) => {
	return createStore<CommentStore>()((set, get) => ({
		...initState,
		addComment: async (comment) => {
			const response = await axios.post(apiString(uuidv4()), comment);
			const { comments } = get();
			set({ comments: [...comments, response.data] });
			return response.data;
		},
		updateComment: async (commentId, comment) => {
			const response = await axios.put(apiString(commentId), comment);
			const { comments } = get();
			set({
				comments: comments.map((t) => (t.id === commentId ? response.data : t)),
			});
			return response.data;
		},
		deleteComment: async (commentId) => {
			await axios.delete(apiString(commentId));
			const { comments } = get();
			set({
				comments: comments.filter((t) => t.id !== commentId),
			});
		},
		getComment: async (commentId) => {
			const { comments } = get();
			const existing = comments.find((t) => t.id === commentId);
			if (existing) return existing;
			const response = await axios.get(apiString(commentId));
			return response.data;
		},
		getAllComments: async (taskId) => {
			const response: { data: Comment[] } = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVERZ}/api/team/${taskId}/comment`,
			);
			set({ comments: response.data });
			return response.data;
		},
	}));
};
