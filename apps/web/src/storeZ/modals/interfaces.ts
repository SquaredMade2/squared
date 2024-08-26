import type { Task } from "@repo/db";

export type ModalState = {
	showTaskForm: boolean;
	taskFormData: Partial<Task>;
	showCommand: boolean;
};

export type ModalActions = {
	setShowTaskForm: (input: boolean) => () => void;
	setTaskFormData: (task: Partial<Task>) => () => void;
	setShowCommand: (input: boolean) => () => void;
};

export type ModalStore = ModalState & ModalActions;
