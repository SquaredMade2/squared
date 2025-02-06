import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store";
import type { Label } from "@squared/db";
import { Pencil } from "lucide-react";

export const EditLabelButton = ({ label }: { label: Label }) => {
	const { setShowLabelModal, setLabelData, showLabelModal, labelData } =
		useModalStore((state) => state);
	console.log(labelData, showLabelModal);
	const handleEditClick = () => {
		setLabelData(label);
		setShowLabelModal(true);
	};

	return (
		<Button onClick={handleEditClick} variant="ghost">
			<Pencil className="h-4 w-4" />
		</Button>
	);
};
