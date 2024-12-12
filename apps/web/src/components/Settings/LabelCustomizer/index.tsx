import { useWorkspaceStore } from "@/store";
import { LabelItem } from "./LabelItem";

export const LabelCustomizer = () => {
	const { workspace } = useWorkspaceStore((state) => state);
	console.log(workspace?.Labels);

	return (
		<div>
			{workspace?.Labels.map((label) => (
				<LabelItem key={label.id} label={label} />
			))}
		</div>
	);
};
