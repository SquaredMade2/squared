import type { Task } from "@repo/db";

export type ModalState = {
	showNewIssue: boolean;
	newIssueData: Partial<Task>;
	showCommand: boolean;
	showRename: boolean;
	renameData: Task | null;
	showWorkspaceInvite: boolean;
};

export type ModalActions = {
	setShowNewIssue: (input: boolean) => void;
	setShowRename: (input: boolean) => void;
	setRenameData: (input: Task) => void;
	setNewIssueData: (task: Partial<Task>) => void;
	setShowCommand: (input: boolean) => void;
	setShowWorkspaceInvite: (input: boolean) => void;
};

export type ModalStore = ModalState & ModalActions;
