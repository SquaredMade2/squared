import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";

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
		<Dialog open={dialogOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>End Sprint</DialogTitle>
					<DialogDescription>
						Are you sure you want to end this sprint?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose>Cancel</DialogClose>
					<Button className="mb-3 sm:mb-0" onClick={onSubmit}>
						End Sprint
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EndSprintDialog;
