import type { Task } from "@repo/db";

export interface DeleteConfirmCardProps {
	onClose: () => void;
	handleDeleteTaskCard: (task: Task) => void;
	deleteFade: boolean;
	task: Task;
}
