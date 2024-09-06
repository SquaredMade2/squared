"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createWorkspaceStore, type WorkspaceStore } from "."; // Import your store creation and types

// Define the type for Workspace Store API
export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;

// Create a context for the Workspace Store
export const WorkspaceStoreContext = createContext<
	WorkspaceStoreApi | undefined
>(undefined);

// Create the Workspace Store Provider component
export const WorkspaceStoreProvider = ({
	children,
}: { children: ReactNode }) => {
	const storeRef = useRef<WorkspaceStoreApi>();

	// Initialize the store in the ref
	if (!storeRef.current) {
		storeRef.current = createWorkspaceStore();
	}

	return (
		<WorkspaceStoreContext.Provider value={storeRef.current}>
			{children}
		</WorkspaceStoreContext.Provider>
	);
};

// Create a hook to access the Workspace Store
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
