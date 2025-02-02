"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type TeamStore, createTeamStore } from ".";

type TeamStoreApi = ReturnType<typeof createTeamStore>;

const TeamStoreContext = createContext<TeamStoreApi | undefined>(undefined);

export const TeamStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<TeamStoreApi>(undefined);
	if (!storeRef.current) {
		storeRef.current = createTeamStore();
	}

	return (
		<TeamStoreContext.Provider value={storeRef.current}>
			{children}
		</TeamStoreContext.Provider>
	);
};

export const useTeamStore = <T,>(selector: (store: TeamStore) => T): T => {
	const context = useContext(TeamStoreContext);
	if (!context) {
		throw new Error("useTeamStore must be used within TeamStoreProvider");
	}
	return useStore(context, selector);
};
