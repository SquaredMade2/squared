import { Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";

import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import type { RetrospectiveItemType } from "@squaredmade/db";
import { useState } from "react";
import { RetroItemCard } from "./RetroItemCard";
import RetroItemModal from "./RetroItemModal";

interface RetroColumnProps {
	title: string;
	type: RetrospectiveItemType;
	items: RetroItem[];
	onHandleItem: (
		content: string,
		operationType: string,
		type?: RetrospectiveItemType,
		retrospectiveItemId?: string,
	) => void;
	onLikeItem: (itemId: string) => void;
	likedItems: string[];
}

export interface EditContent {
	retrospectiveItemId: string;
	content: string;
}

export const RetroColumn = ({
	title,
	type,
	items,
	onHandleItem,
	onLikeItem,
	likedItems,
}: RetroColumnProps) => {
	const [isEditItem, setIsEditItem] = useState<boolean>(false);
	const [editContent, setEditContent] = useState<EditContent>({
		retrospectiveItemId: "",
		content: "",
	});
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Card className="flex h-full flex-col bg-background">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex grow flex-col">
				<Droppable droppableId={type}>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="mb-4 min-h-[200px] grow space-y-2"
						>
							{items
								.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
								.map((item, index) => {
									return (
										<RetroItemCard
											key={item.id}
											item={item}
											index={index}
											setIsEditItem={setIsEditItem}
											setEditContent={setEditContent}
											setIsModalOpen={setIsModalOpen}
											onLikeItem={onLikeItem}
											liked={likedItems.includes(item.id)}
										/>
									);
								})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<RetroItemModal
					type={type}
					onHandleItem={onHandleItem}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					isEditItem={isEditItem}
					setIsEditItem={setIsEditItem}
					editContent={editContent}
					setEditContent={setEditContent}
				/>
			</CardContent>
		</Card>
	);
};
