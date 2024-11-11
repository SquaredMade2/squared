import type { Task } from "@squared/db";

export type ModalState = {
	showNewIssue: boolean;
	newIssueData: Partial<Task>;
	showCommand: boolean;
	showRename: boolean;
	renameData: Task | null;
	showWorkspaceInvite: boolean;
	showSwitchWorkspace: boolean;
	showLinkForm: boolean;
	showTaskSelector: boolean;
};

type ModalActions = {
	setShowNewIssue: (input: boolean) => void;
	setShowRename: (input: boolean) => void;
	setRenameData: (input: Task) => void;
	setNewIssueData: (task: Partial<Task>) => void;
	setShowCommand: (input: boolean) => void;
	setShowWorkspaceInvite: (input: boolean) => void;
	setShowSwitchWorkspace: (input: boolean) => void;
	setShowTaskSelector: (input: boolean) => void;
	setShowLinkForm: (input: boolean) => void;
};

export type ModalStore = ModalState & ModalActions;
