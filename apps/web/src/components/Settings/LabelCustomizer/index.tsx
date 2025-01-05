import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { workspaceService } from "@/lib/services";
import { useModalStore, useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { TODO } from "@squared/context";
import type { Label } from "@squared/db";
import { LabelItem } from "./LabelItem";

export const LabelCustomizer = () => {
	const { toast } = useToast();
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);
	const { setShowLabelModal } = useModalStore((state) => state); // where did i put LabelModal?? and why???
	console.log(workspace?.Labels);
	const handleDelete = async (label: Label) => {
		try {
			console.log("deleting label");
			const updatedWorkspace = await workspaceService.deleteWorkspaceLabel(
				TODO,
				{
					workspaceId: label.workspaceId,
					labelId: label.id,
				},
			);
			setWorkspace(updatedWorkspace);
			console.log("success");
			toast({
				title: "Label deleted",
				description: `${label.name} has been successfully deleted.`,
			});
		} catch (error) {
			toast({
				title: "Error deleting label",
				description: parseError(error),
			});
		}
	};

	return (
		<div>
			<Button onClick={() => setShowLabelModal(true)}>Create New Label</Button>
			<div>
				{workspace?.Labels.map((label) => (
					<LabelItem key={label.id} label={label} handleDelete={handleDelete} />
				))}
			</div>
		</div>
	);
};
