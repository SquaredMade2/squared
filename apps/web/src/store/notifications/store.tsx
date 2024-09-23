"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createNotificationStore, type NotificationStore } from ".";

type NotificationStoreApi = ReturnType<typeof createNotificationStore>;

const NotificationStoreContext = createContext<
	NotificationStoreApi | undefined
>(undefined);

export const NotificationStoreProvider = ({
	children,
}: { children: ReactNode }) => {
	const storeRef = useRef<NotificationStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createNotificationStore();
	}

	return (
		<NotificationStoreContext.Provider value={storeRef.current}>
			{children}
		</NotificationStoreContext.Provider>
	);
};

export const useNotificationStore = <T,>(
	selector: (store: NotificationStore) => T,
): T => {
	const context = useContext(NotificationStoreContext);
	if (!context) {
		throw new Error(
			"useNotificationStore must be used within NotificationStoreProvider",
		);
	}
	return useStore(context, selector);
};
