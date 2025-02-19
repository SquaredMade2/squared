import { createStore } from "zustand/vanilla";
import type { ModalState, ModalStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createModalStore = (
	initState: ModalState = {
		showNewTask: false,
		showCommand: false,
		showRename: false,
		renameData: null,
		showWorkspaceInvite: false,
		showSwitchWorkspace: false,
		showTaskSelector: false,
		showLinkForm: false,
		showInvite: false,
		newTaskData: {},
		showLabelModal: false,
		labelData: {},
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setShowNewTask: (input) => {
			set({ showNewTask: input });
		},
		setShowRename: (input) => {
			set({ showRename: input });
		},
		setRenameData: (input) => {
			set({ renameData: input });
		},
		setNewTaskData: (task) => {
			set({ newTaskData: task });
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
		setShowLinkForm: (input) => {
			set({ showLinkForm: input });
		},
		setShowTaskSelector: (input) => {
			set({ showTaskSelector: input });
		},
		setShowInvite: (input) => {
			set({ showInvite: input });
		},
		setShowLabelModal: (input) => {
			set({ showLabelModal: input });
		},
		setLabelData: (input) => {
			set({ labelData: input });
		},
	}));
};
