"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createTaskStore, type TaskState } from ".";

export type TaskStoreApi = ReturnType<typeof createTaskStore>;

export const TaskStoreContext = createContext<TaskStoreApi | undefined>(
	undefined,
);

export const TaskStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<TaskStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createTaskStore();
	}

	return (
		<TaskStoreContext.Provider value={storeRef.current}>
			{children}
		</TaskStoreContext.Provider>
	);
};

export const useTaskStore = <T,>(selector: (store: TaskState) => T): T => {
	const context = useContext(TaskStoreContext);
	if (!context) {
		throw new Error("useTaskStore must be used within TaskStoreProvider");
	}
	return useStore(context, selector);
};
