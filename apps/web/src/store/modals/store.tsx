"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type ModalStore, createModalStore } from ".";

type ModalStoreApi = ReturnType<typeof createModalStore>;

const ModalStoreContext = createContext<ModalStoreApi | undefined>(undefined);

export const ModalStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<ModalStoreApi>(undefined);
	if (!storeRef.current) {
		storeRef.current = createModalStore();
	}

	return (
		<ModalStoreContext.Provider value={storeRef.current}>
			{children}
		</ModalStoreContext.Provider>
	);
};

export const useModalStore = <T,>(selector: (store: ModalStore) => T): T => {
	const context = useContext(ModalStoreContext);
	if (!context) {
		throw new Error("useModalStore must be used within ModalStoreProvider");
	}
	return useStore(context, selector);
};
