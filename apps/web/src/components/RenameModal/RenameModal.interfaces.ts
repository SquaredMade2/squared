import type { Task } from "@repo/db";
import type { FormSubmitEvent } from "@/types";

export interface RenameModalProps {
	showRenameModal: boolean;
	setShowRenameModal(argunment: boolean): void;
	searchSubmit?: (event: FormSubmitEvent) => void;
	taskData: Task;
}
