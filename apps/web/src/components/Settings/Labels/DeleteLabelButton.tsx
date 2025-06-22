import { Button } from "@squaredmade/ui/button";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { client } from "@/lib/client";

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
		onError: (error) => {
			toast.error("Label could not be deleted", {
				description: error.message,
			});
		},
		onSuccess: () => {
			toast.success(`${labelName} successfully deleted`);
			refetch();
		},
	});

	return (
		<>
			<Button onClick={() => deleteLabelMutation.mutate()} variant="ghost">
				<Trash className="h-4 w-4" />
			</Button>
		</>
	);
};
