"use client";

import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@squaredmade/ui/dialog";
import { useState } from "react";

type DeleteUserModalProps = {
	handleDelete: () => void;
};

export const DeleteUserConfirmationModal = ({
	handleDelete,
}: DeleteUserModalProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleDeleteAndClose = () => {
		handleDelete();
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button type="button" variant="destructive">
					Delete Account
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
						<br />
						<Button
							className="mt-2"
							onClick={handleDeleteAndClose}
							type="submit"
							variant="destructive"
						>
							Yes
						</Button>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
