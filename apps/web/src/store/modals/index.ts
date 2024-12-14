import { createStore } from "zustand/vanilla";
import type { ModalState, ModalStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createModalStore = (
	initState: ModalState = {
		showNewTask: false,
		newTaskData: {},
		showRename: false,
		renameData: null,
		showLabelModal: false,
		labelData: {},
		showCommand: false,
		showWorkspaceInvite: false,
		showSwitchWorkspace: false,
		showTaskSelector: false,
		showLinkForm: false,
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setShowNewTask: (input) => {
			set({ showNewTask: input });
		},
		setNewTaskData: (task) => {
			set({ newTaskData: task });
		},
		setShowRename: (input) => {
			set({ showRename: input });
		},
		setRenameData: (input) => {
			set({ renameData: input });
		},
		setShowLabelModal: (input) => {
			set({ showLabelModal: input });
		},
		setLabelData: (input) => {
			set({ labelData: input });
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
		setShowTaskSelector: (input) => {
			set({ showTaskSelector: input });
		},
		setShowLinkForm: (input) => {
			set({ showLinkForm: input });
		},
	}));
};
