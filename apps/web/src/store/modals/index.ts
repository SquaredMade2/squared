import { createStore } from "zustand/vanilla";
import type { ModalState, ModalStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createModalStore = (
	initState: ModalState = {
		showNewIssue: false,
		showCommand: false,
		showRename: false,
		renameData: null,
		showWorkspaceInvite: false,
		showSwitchWorkspace: false,
		newIssueData: {},
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setShowNewIssue: (input) => {
			set({ showNewIssue: input });
		},
		setShowRename: (input) => {
			set({ showRename: input });
		},
		setRenameData: (input) => {
			set({ renameData: input });
		},
		setNewIssueData: (task) => {
			set({ newIssueData: task });
		},
		setShowCommand: (input) => {
			set({ showCommand: input });
		},
		setShowWorkspaceInvite: (input) => {
			set({ showWorkspaceInvite: input });
		},
		setShowSwitchWorkspace: (input) => {
			set({ showSwitchWorkspace: input });
		},
	}));
};
