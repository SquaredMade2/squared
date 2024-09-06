"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type SquaredState, createSquaredStore } from "@/storeZ";

export type SquaredStoreApi = ReturnType<typeof createSquaredStore>;

export const SquaredStoreContext = createContext<SquaredStoreApi | undefined>(
	undefined,
);

export interface SquaredStoreProviderProps {
	children: ReactNode;
}

export const SquaredStoreProvider = ({
	children,
}: SquaredStoreProviderProps) => {
	const storeRef = useRef<SquaredStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createSquaredStore();
	}

	return (
		<SquaredStoreContext.Provider value={storeRef.current}>
			{children}
		</SquaredStoreContext.Provider>
	);
};

export const useSquaredStore = <T,>(
	selector: (store: SquaredState) => T,
): T => {
	const counterStoreContext = useContext(SquaredStoreContext);

	if (!counterStoreContext) {
		throw new Error("useSquaredStore must be used within SquaredStoreProvider");
	}

	return useStore(counterStoreContext, selector);
};

export const useActivityStore = () => {
	return useSquaredStore((state) => state.activities);
};

export const useAuthStore = () => {
	return useSquaredStore((state) => state.auth);
};

export const useCommentStore = () => {
	return useSquaredStore((state) => state.comments);
};

export const useModalStore = () => {
	return useSquaredStore((state) => state.modals);
};

export const useNotificationStore = () => {
	return useSquaredStore((state) => state.notifications);
};

export const useTaskStore = () => {
	return useSquaredStore((state) => state.tasks);
};

export const useTeamStore = () => {
	return useSquaredStore((state) => state.teams);
};

export const useUserStore = () => {
	return useSquaredStore((state) => state.users);
};

export const useViewsStore = () => {
	return useSquaredStore((state) => state.views);
};

export const useWorkspaceStore = () => {
	return useSquaredStore((state) => state.workspaces);
};
