import type { Label, Task } from "@squared/db";

export type ModalState = {
	showNewTask: boolean;
	newTaskData: Partial<Task>;
	showRename: boolean;
	renameData: Task | null;
	showLabelModal: boolean;
	labelData: Label | null;
	showCommand: boolean;
	showWorkspaceInvite: boolean;
	showSwitchWorkspace: boolean;
	showTaskSelector: boolean;
	showLinkForm: boolean;
};

type ModalActions = {
	setShowNewTask: (input: boolean) => void;
	setNewTaskData: (task: Partial<Task>) => void;
	setShowRename: (input: boolean) => void;
	setRenameData: (input: Task) => void;
	setShowLabelModal: (input: boolean) => void;
	setLabelData: (input: Label) => void;
	setShowCommand: (input: boolean) => void;
	setShowWorkspaceInvite: (input: boolean) => void;
	setShowSwitchWorkspace: (input: boolean) => void;
	setShowTaskSelector: (input: boolean) => void;
	setShowLinkForm: (input: boolean) => void;
};

export type ModalStore = ModalState & ModalActions;
