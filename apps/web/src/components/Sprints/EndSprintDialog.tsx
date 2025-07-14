import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@squaredmade/ui/alert-dialog";
import { Button } from "@squaredmade/ui/button";

interface EndSprintDialogProps {
	dialogOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: () => void;
}

const EndSprintDialog = ({
	dialogOpen,
	onOpenChange,
	onSubmit,
}: EndSprintDialogProps) => {
	return (
		<AlertDialog onOpenChange={onOpenChange} open={dialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>End Sprint</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to end this sprint?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button className="mb-3 sm:mb-0" onClick={onSubmit}>
						End Sprint
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default EndSprintDialog;
