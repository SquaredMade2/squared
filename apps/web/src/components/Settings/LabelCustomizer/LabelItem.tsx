import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/store";
import type { Label } from "@squared/db";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

export const LabelItem = ({ label }: { label: Label }) => {
	const { setShowLabelModal, setLabelData } = useModalStore((state) => state);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	const handleDelete = () => {
		console.log(label);
	};

	const handleEdit = () => {
		setLabelData(label);
		setShowLabelModal(true);
	};

	return (
		<>
			<Card className="py-1 px-4 my-2">
				<div className="p-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<LabelColor label={label} />
						<div>
							<div className="font-bold">{label.name}</div>
							<div className="text-muted-foreground">{label.description}</div>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Ellipsis className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="flex flex-col">
							<DropdownMenuItem onSelect={() => handleEdit()}>
								<Button variant="ghost">Edit Label</Button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button variant="ghost">View Label Issues</Button>
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setShowConfirmDelete(true)}>
								<Button variant="ghost">Delete Label</Button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Card>

			<AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Label</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{label.name}"?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={handleDelete}
						>
							Delete Task
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
