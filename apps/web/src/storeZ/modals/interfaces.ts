import type { Task } from "@repo/db";

export type ModalState = {
	showNewIssue: boolean;
	newIssueData: Partial<Task>;
	showCommand: boolean;
	showWorkspaceInvite: boolean;
};

export type ModalActions = {
	setShowNewIssue: (input: boolean) => void;
	setNewIssueData: (task: Partial<Task>) => void;
	setShowCommand: (input: boolean) => void;
	setShowWorkspaceInvite: (input: boolean) => void;
};

export type ModalStore = ModalState & ModalActions;
