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
		setShowTaskForm: (input) => async () => {
			set({ showTaskForm: input });
		},
		setTaskFormData: (task) => async () => {
			set({ taskFormData: task });
		},
		setShowCommand: (input) => async () => {
			set({ showCommand: input });
		},
	}));
};
