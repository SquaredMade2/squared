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
	return useSquaredStore((state) => state.activities.getState());
};

export const useAuthStore = () => {
	return useSquaredStore((state) => state.auth.getState());
};

export const useCommentStore = () => {
	return useSquaredStore((state) => state.comments.getState());
};

export const useModalStore = () => {
	return useSquaredStore((state) => state.modals.getState());
};

export const useNotificationStore = () => {
	return useSquaredStore((state) => state.notifications.getState());
};

export const useTaskStore = () => {
	return useSquaredStore((state) => state.tasks.getState());
};

export const useTeamStore = () => {
	return useSquaredStore((state) => state.teams.getState());
};

export const useUserStore = () => {
	return useSquaredStore((state) => state.users.getState());
};

export const useViewsStore = () => {
	return useSquaredStore((state) => state.views.getState());
};

export const useWorkspaceStore = () => {
	return useSquaredStore((state) => state.workspaces.getState());
};

export const useUserSettingsStore = () => {
	return useSquaredStore((state) => state.userSettings.getState());
};
