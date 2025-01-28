"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type TaskStore, createTaskStore } from ".";

type TaskStoreApi = ReturnType<typeof createTaskStore>;

const TaskStoreContext = createContext<TaskStoreApi | undefined>(undefined);

export const TaskStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<TaskStoreApi>(undefined);
	if (!storeRef.current) {
		storeRef.current = createTaskStore();
	}

	return (
		<TaskStoreContext.Provider value={storeRef.current}>
			{children}
		</TaskStoreContext.Provider>
	);
};

export const useTaskStore = <T,>(selector: (store: TaskStore) => T): T => {
	const context = useContext(TaskStoreContext);
	if (!context) {
		throw new Error("useTaskStore must be used within TaskStoreProvider");
	}
	return useStore(context, selector);
};
