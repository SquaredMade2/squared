import { Button } from "@/components/ui/button";
import { useModalStore, useWorkspaceStore } from "@/store";
import { LabelItem } from "./LabelItem";

export const LabelCustomizer = () => {
	const { workspace } = useWorkspaceStore((state) => state);
	const { showLabelModal, setShowLabelModal } = useModalStore((state) => state);
	console.log(showLabelModal);
	return (
		<div>
			<Button onClick={() => setShowLabelModal(true)}>Create New Label</Button>
			<div>
				{workspace?.Labels.map((label) => (
					<LabelItem key={label.id} label={label} />
				))}
			</div>
		</div>
	);
};
