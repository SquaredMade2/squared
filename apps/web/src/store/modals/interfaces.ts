import type { Label, Task } from "@squaredmade/db";

export type ModalState = {
	showNewTask: boolean;
	newTaskData: Partial<Task>;
	showCommand: boolean;
	showRename: boolean;
	renameData: Task | null;
	showWorkspaceInvite: boolean;
	showSwitchWorkspace: boolean;
	showLinkForm: boolean;
	showTaskSelector: boolean;
	showLabelModal: boolean;
	labelData: Partial<Label>;
};

type ModalActions = {
	setShowNewTask: (input: boolean) => void;
	setShowRename: (input: boolean) => void;
	setRenameData: (input: Task) => void;
	setNewTaskData: (task: Partial<Task>) => void;
	setShowCommand: (input: boolean) => void;
	setShowWorkspaceInvite: (input: boolean) => void;
	setShowSwitchWorkspace: (input: boolean) => void;
	setShowTaskSelector: (input: boolean) => void;
	setShowLinkForm: (input: boolean) => void;
	setShowLabelModal: (input: boolean) => void;
	setLabelData: (input: Partial<Label>) => void;
};

export type ModalStore = ModalState & ModalActions;
