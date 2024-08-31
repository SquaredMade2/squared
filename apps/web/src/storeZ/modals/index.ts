import { createStore } from "zustand/vanilla";
import type { ModalState, ModalStore } from "./interfaces";
export * from "./interfaces";

export const createModalStore = (
	initState: ModalState = {
		showTaskForm: false,
		showCommand: false,
		taskFormData: {},
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setShowTaskForm: (input) => {
			set({ showTaskForm: input });
		},
		setTaskFormData: (task) => {
			set({ taskFormData: task });
		},
		setShowCommand: (input) => {
			set({ showCommand: input });
		},
	}));
};
