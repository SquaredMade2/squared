import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import type { Label } from "@squared/db";
import { Trash } from "lucide-react";

export const DeleteLabelButton = ({
	labelName,
	pageId,
	labels,
	refetch,
}: {
	labelName: string;
	pageId: string;
	labels: Label[];
	refetch: () => void;
}) => {
	const { toast } = useToast();

	const handleDeleteClick = async () => {
		try {
			await client.workspace.deleteWorkspaceLabel
				.$post({ workspaceId: pageId, labelName: labelName })
				.then((res) => res.json());
			toast({ title: `${labelName} successfully deleted` });
			labels && refetch();
		} catch (error) {
			console.error(error);
			toast({
				title: "Label could not be deleted",
				description: "An unknown error occurred",
				variant: "destructive",
			});
		}
	};
	return (
		<>
			<Button onClick={handleDeleteClick} variant="ghost">
				<Trash className="h-4 w-4" />
			</Button>
		</>
	);
};
