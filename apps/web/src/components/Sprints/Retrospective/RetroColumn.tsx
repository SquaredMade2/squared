import { Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";

import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import type { RetrospectiveItemType } from "@squared/db";
import AddRetroItemModal from "./AddRetroItemModal";
import { RetroItemCard } from "./RetroItemCard";

interface RetroColumnProps {
	title: string;
	type: RetrospectiveItemType;
	items: RetroItem[];
	onAddItem: (type: RetrospectiveItemType, content: string) => void;
	onLikeItem: (itemId: string, userId: string) => void;
}

export const RetroColumn = ({
	title,
	type,
	items,
	onAddItem,
	onLikeItem,
}: RetroColumnProps) => {
	return (
		<Card className="h-full flex flex-col bg-background">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow flex flex-col">
				<Droppable droppableId={type}>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="flex-grow mb-4 space-y-2 min-h-[200px]"
						>
							{items.map((item, index) => {
								return (
									<RetroItemCard
										key={item.id}
										item={item}
										index={index}
										onLikeItem={onLikeItem}
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

export default RetroColumn;
