import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { CommentState, CommentStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { Comment } from "@repo/db";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/comment/${path}`;

export const createCommentStore = (
	initState: CommentState = { comments: [] },
) => {
	return createStore<CommentStore>()((set) => ({
		...initState,
		addComment: (comment) => async (state) => {
			const response = await axios.post(apiString(uuidv4()), comment);
			set({ comments: [...state.comments, response.data] });
			return response.data;
		},
		updateComment: (commentId, comment) => async (state) => {
			const response = await axios.put(apiString(commentId), comment);
			set({
				comments: state.comments.map((t) =>
					t.id === commentId ? response.data : t,
				),
			});
			return response.data;
		},
		deleteComment: (commentId) => async (state) => {
			await axios.delete(apiString(commentId));
			set({
				comments: state.comments.filter((t) => t.id !== commentId),
			});
		},
		getComment: (commentId) => async (state) => {
			const existing = state.comments.find((t) => t.id === commentId);
			if (existing) return existing;
			const response = await axios.get(apiString(commentId));
			return response.data;
		},
		getAllComments: (taskId) => async (state) => {
			const response: { data: Comment[] } = await axios.get(
				`${process.env.SERVER_URL}/api/team/${taskId}/comment`,
			);
			set({ comments: response.data });
			return response.data;
		},
	}));
};
