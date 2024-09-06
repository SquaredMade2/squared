import { createStore } from "zustand/vanilla";
import type { ModalState, ModalStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createModalStore = (
	initState: ModalState = {
		showNewIssue: false,
		showCommand: false,
		newIssueData: {},
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setShowNewIssue: (input) => {
			set({ showNewIssue: input });
		},
		setNewIssueData: (task) => {
			set({ newIssueData: task });
		},
		setShowCommand: (input) => {
			set({ showCommand: input });
		},
	}));
};
