import type { Task } from "@/storeZ";

export interface DeleteConfirmCardProps {
	onClose: () => void;
	handleDeleteTaskCard: (task: Task) => void;
	deleteFade: boolean;
	task: Task;
}
