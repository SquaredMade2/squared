"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createWorkspaceStore, type WorkspaceState } from "."; // Import your store creation and types

// Define the type for Workspaces Store API
export type WorkspacesStoreApi = ReturnType<typeof createWorkspaceStore>;

// Create a context for the Workspaces Store
export const WorkspacesStoreContext = createContext<
	WorkspacesStoreApi | undefined
>(undefined);

// Create the Workspaces Store Provider component
export const WorkspacesStoreProvider = ({
	children,
}: { children: ReactNode }) => {
	const storeRef = useRef<WorkspacesStoreApi>();

	// Initialize the store in the ref
	if (!storeRef.current) {
		storeRef.current = createWorkspaceStore();
	}

	return (
		<WorkspacesStoreContext.Provider value={storeRef.current}>
			{children}
		</WorkspacesStoreContext.Provider>
	);
};

// Create a hook to access the Workspaces Store
export const useWorkspaceStore = <T,>(
	selector: (store: WorkspaceState) => T,
): T => {
	const context = useContext(WorkspacesStoreContext);

	if (!context) {
		throw new Error(
			"useWorkspaceStore must be used within WorkspacesStoreProvider",
		);
	}

	return useStore(context, selector);
};
