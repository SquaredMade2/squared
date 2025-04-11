import { useModalStore } from "@/store";
import type { Label } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { Pencil } from "lucide-react";

export const EditLabelButton = ({ label }: { label: Label }) => {
	const { setShowLabelModal, setLabelData } = useModalStore((state) => state);

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
