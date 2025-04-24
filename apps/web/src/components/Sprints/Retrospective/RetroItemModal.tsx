import { CirclePlus } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@squaredmade/ui/dialog";
import { Input } from "@squaredmade/ui/input";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useState,
} from "react";
import type { EditContent } from "./RetroColumn";

type ColumnType = "wentWell" | "toImprove" | "actionItems";

interface RetroItemModalProps {
	type: ColumnType;
	onHandleItem: (
		content: string,
		operationType: string,
		type?: ColumnType,
		retrospectiveItemId?: string,
	) => void;
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	isEditItem: boolean;
	setIsEditItem: Dispatch<SetStateAction<boolean>>;
	editContent: EditContent;
	setEditContent: Dispatch<SetStateAction<EditContent>>;
}

const RetroItemModal = ({
	type,
	onHandleItem,
	isModalOpen,
	setIsModalOpen,
	isEditItem,
	setIsEditItem,
	editContent,
	setEditContent,
}: RetroItemModalProps) => {
	const initialContentState = isEditItem ? editContent.content : "";
	const [itemContent, setItemContent] = useState(initialContentState);

	const handleItem = useCallback(() => {
		const operationType = isEditItem ? "edit" : "add";
		if (itemContent.trim()) {
			onHandleItem(
				itemContent.trim(),
				operationType,
				type,
				editContent.retrospectiveItemId,
			);
			setItemContent("");
			if (isEditItem) {
				setIsEditItem(false);
				setEditContent({ retrospectiveItemId: "", content: "" });
			}
			setIsModalOpen(false);
		}
	}, [itemContent, onHandleItem, type]);

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={
				isEditItem
					? () => {
							setIsEditItem(false);
							setEditContent({ retrospectiveItemId: "", content: "" });
							setIsModalOpen(false);
						}
					: setIsModalOpen
			}
		>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					<CirclePlus className="mr-2 h-4 w-4" />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditItem ? "Edit Item" : "Add New Item"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Input
							id="new-item"
							value={itemContent}
							onChange={(e) => setItemContent(e.target.value)}
							placeholder="Enter item content"
							className="col-span-4"
							autoFocus
						/>
					</div>
				</div>
				<Button onClick={handleItem} variant="secondary" tabIndex={0}>
					{isEditItem ? "Update Item" : "Add Item"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default RetroItemModal;
