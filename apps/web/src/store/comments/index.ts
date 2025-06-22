import { createStore } from "zustand/vanilla";
import type { CommentState, CommentStore } from "./interfaces";

export type { CommentState, CommentStore } from "./interfaces";
export { CommentStoreProvider, useCommentStore } from "./store";

export const createCommentStore = (
	initState: CommentState = { comments: [] },
) => {
	return createStore<CommentStore>()((set) => ({
		...initState,
		setComments: (comments) => set({ comments }),
	}));
};
