"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type CommentStore, createCommentStore } from ".";

type CommentStoreApi = ReturnType<typeof createCommentStore>;

const CommentStoreContext = createContext<CommentStoreApi | undefined>(
	undefined,
);

export const CommentStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<CommentStoreApi>(undefined);
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
	selector: (store: CommentStore) => T,
): T => {
	const context = useContext(CommentStoreContext);
	if (!context) {
		throw new Error("useCommentStore must be used within CommentStoreProvider");
	}
	return useStore(context, selector);
};
