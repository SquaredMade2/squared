import { client } from "@/lib/client";
import { Button } from "@squaredmade/ui/button";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";

export const DeleteLabelButton = ({
	labelName,
	refetch,
}: {
	labelName: string;
	pageId: string;
	refetch: () => void;
}) => {
	const deleteLabelMutation = useMutation({
		mutationFn: async () => {
			await client.workspace.deleteWorkspaceLabel
				.$post({ labelName })
				.then((res) => res.json());
		},
		onSuccess: () => {
			toast.success(`${labelName} successfully deleted`);
			refetch();
		},
		onError: (error) => {
			console.error(error);
			toast.error("Label could not be deleted", {
				description: "An unknown error occurred",
			});
		},
	});

	const handleDeleteClick = async () => {
		deleteLabelMutation.mutate();
	};

	return (
		<>
			<Button onClick={handleDeleteClick} variant="ghost">
				<Trash className="h-4 w-4" />
			</Button>
		</>
	);
};
