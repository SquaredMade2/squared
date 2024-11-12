"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type WorkspaceStore, createWorkspaceStore } from ".";

type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;

const WorkspaceStoreContext = createContext<WorkspaceStoreApi | undefined>(
	undefined,
);

export const WorkspaceStoreProvider = ({
	children,
}: { children: ReactNode }) => {
	const storeRef = useRef<WorkspaceStoreApi>();

	if (!storeRef.current) {
		storeRef.current = createWorkspaceStore();
	}

	return (
		<WorkspaceStoreContext.Provider value={storeRef.current}>
			{children}
		</WorkspaceStoreContext.Provider>
	);
};

export const useWorkspaceStore = <T,>(
	selector: (store: WorkspaceStore) => T,
): T => {
	const context = useContext(WorkspaceStoreContext);

	if (!context) {
		throw new Error(
			"useWorkspacetore must be used within WorkspaceStoreProvider",
		);
	}

	return useStore(context, selector);
};
