import { Button } from "@squared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@squared/ui/dialog";
import { Input } from "@squared/ui/input";
import { PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";

type ColumnType = "wentWell" | "toImprove" | "actionItems";

interface AddRetroItemModalProps {
	type: ColumnType;
	onAddItem: (type: ColumnType, content: string) => void;
}

const AddRetroItemModal = ({ type, onAddItem }: AddRetroItemModalProps) => {
	const [newItemContent, setNewItemContent] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleAddItem = useCallback(() => {
		if (newItemContent.trim()) {
			onAddItem(type, newItemContent.trim());
			setNewItemContent("");
			setIsOpen(false);
		}
	}, [newItemContent, onAddItem, type]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					<PlusCircle className="mr-2 h-4 w-4" />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Item</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Input
							id="new-item"
							value={newItemContent}
							onChange={(e) => setNewItemContent(e.target.value)}
							placeholder="Enter item content"
							className="col-span-4"
						/>
					</div>
				</div>
				<Button onClick={handleAddItem} variant="secondary">
					Add Item
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default AddRetroItemModal;
