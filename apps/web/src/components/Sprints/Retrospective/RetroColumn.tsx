import { Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";

import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import type { RetrospectiveItemType } from "@squaredmade/db";
import AddRetroItemModal from "./AddRetroItemModal";
import { RetroItemCard } from "./RetroItemCard";

interface RetroColumnProps {
	title: string;
	type: RetrospectiveItemType;
	items: RetroItem[];
	onAddItem: (type: RetrospectiveItemType, content: string) => void;
	onLikeItem: (itemId: string) => void;
	likedItems: string[];
}

export const RetroColumn = ({
	title,
	type,
	items,
	onAddItem,
	onLikeItem,
	likedItems,
}: RetroColumnProps) => {
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
											onLikeItem={onLikeItem}
											liked={likedItems.includes(item.id)}
										/>
									);
								})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<AddRetroItemModal type={type} onAddItem={onAddItem} />
			</CardContent>
		</Card>
	);
};
