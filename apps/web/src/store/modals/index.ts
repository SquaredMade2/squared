import { createStore } from "zustand/vanilla";
import type { ModalState, ModalStore } from "./interfaces";

export type { ModalState, ModalStore } from "./interfaces";
export { ModalStoreProvider, useModalStore } from "./store";

export const createModalStore = (
	initState: ModalState = {
		labelData: {},
		newTaskData: {},
		renameData: null,
		showCommand: false,
		showInvite: false,
		showLabelModal: false,
		showLinkForm: false,
		showNewTask: false,
		showRename: false,
		showSwitchWorkspace: false,
		showTaskSelector: false,
		showWorkspaceInvite: false,
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setLabelData: (input) => {
			set({ labelData: input });
		},
		setNewTaskData: (task) => {
			set({ newTaskData: task });
		},
		setRenameData: (input) => {
			set({ renameData: input });
		},
		setShowCommand: (input) => {
			set({ showCommand: input });
		},
		setShowInvite: (input) => {
			set({ showInvite: input });
		},
		setShowLabelModal: (input) => {
			set({ showLabelModal: input });
		},
		setShowLinkForm: (input) => {
			set({ showLinkForm: input });
		},
		setShowNewTask: (input) => {
			set({ showNewTask: input });
		},
		setShowRename: (input) => {
			set({ showRename: input });
		},
		setShowSwitchWorkspace: (input) => {
			set({ showSwitchWorkspace: input });
		},
		setShowTaskSelector: (input) => {
			set({ showTaskSelector: input });
		},
		setShowWorkspaceInvite: (input) => {
			set({ showWorkspaceInvite: input });
		},
	}));
};
