import { Button } from "@/components/ui/button";
import type { Label } from "@squared/db";
import { Pencil } from "lucide-react";

export const EditLabelButton = ({ label }: { label: Label }) => {
	const handleEditClick = () => {
		console.log("edit label", label);
	};
	return (
		<Button onClick={handleEditClick} variant="ghost">
			<Pencil />
		</Button>
	);
};
