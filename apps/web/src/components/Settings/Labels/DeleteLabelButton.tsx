import { Button } from "@/components/ui/button";
import type { Label } from "@squared/db";
import { Trash } from "lucide-react";

export const DeleteLabelButton = ({ label }: { label: Label }) => {
	const handleDeleteClick = () => {
		console.log("delete label", label);
	};
	return (
		<Button onClick={handleDeleteClick} variant="ghost">
			<Trash />
		</Button>
	);
};
