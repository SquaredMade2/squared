import type { Task } from "@squaredmade/db";
import { Trash } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { useState } from "react";
import { DeleteTaskAlertDialog } from "../ViewAllTasks/DeleteTaskAlertDialog";

export default function DeleteTaskModal({ task }: { task: Task }) {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	const showConfirmDeleteModal = () => {
		setShowConfirmDelete(true);
	};
	return (
		<>
			<Button
				className="gap-2"
				onClick={showConfirmDeleteModal}
				variant="destructive"
			>
				<Trash className="h-4 w-4" />
				Delete
			</Button>

			<DeleteTaskAlertDialog
				redirectTask
				setShowConfirmDelete={setShowConfirmDelete}
				showConfirmDelete={showConfirmDelete}
				task={task}
			/>
		</>
	);
}
