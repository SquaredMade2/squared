import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { Trash } from "@squaredmade/icons";
import { useMutation } from "@tanstack/react-query";

export const DeleteLabelButton = ({
	labelName,
	refetch,
}: {
	labelName: string;
	pageId: string;
	refetch: () => void;
}) => {
	const { toast } = useToast();

	const deleteLabelMutation = useMutation({
		mutationFn: async () => {
			await client.workspace.deleteWorkspaceLabel
				.$post({ labelName: labelName })
				.then((res) => res.json());
		},
		onSuccess: () => {
			toast({ title: `${labelName} successfully deleted` });
			refetch();
		},
		onError: (error) => {
			console.error(error);
			toast({
				title: "Label could not be deleted",
				description: "An unknown error occurred",
				variant: "destructive",
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
