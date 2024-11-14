"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type EventStore, createEventStore } from ".";

type EventStoreApi = ReturnType<typeof createEventStore>;

const EventStoreContext = createContext<EventStoreApi | undefined>(undefined);

export const EventStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<EventStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createEventStore();
	}

	return (
		<EventStoreContext.Provider value={storeRef.current}>
			{children}
		</EventStoreContext.Provider>
	);
};

export const useEventStore = <T,>(selector: (store: EventStore) => T): T => {
	const context = useContext(EventStoreContext);
	if (!context) {
		throw new Error("useEventStore must be used within EventStoreProvider");
	}
	return useStore(context, selector);
};
