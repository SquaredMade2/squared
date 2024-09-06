"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createCommentStore, type CommentState } from ".";

export type CommentStoreApi = ReturnType<typeof createCommentStore>;

export const CommentStoreContext = createContext<CommentStoreApi | undefined>(
	undefined,
);

export const CommentStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<CommentStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createCommentStore();
	}

	return (
		<CommentStoreContext.Provider value={storeRef.current}>
			{children}
		</CommentStoreContext.Provider>
	);
};

export const useCommentStore = <T,>(
	selector: (store: CommentState) => T,
): T => {
	const context = useContext(CommentStoreContext);
	if (!context) {
		throw new Error("useCommentStore must be used within CommentStoreProvider");
	}
	return useStore(context, selector);
};
