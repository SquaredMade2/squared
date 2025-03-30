import { Button } from "@/components/ui/button";
import type { Task } from "@squaredmade/db";
import { Trash } from "@squaredmade/icons";
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
				onClick={showConfirmDeleteModal}
				className="gap-2"
				variant="destructive"
			>
				<Trash className="h-4 w-4" />
				Delete
			</Button>

			<DeleteTaskAlertDialog
				redirectTask={true}
				task={task}
				showConfirmDelete={showConfirmDelete}
				setShowConfirmDelete={setShowConfirmDelete}
			/>
		</>
	);
}
