import { Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import type { RetrospectiveItemType } from "@squared/db";
import AddRetroItemModal from "./AddRetroItemModal";
import { RetroItemCard } from "./RetroItemCard";

interface RetroColumnProps {
	title: string;
	type: RetrospectiveItemType;
	items: RetroItem[];
	onAddItem: (type: RetrospectiveItemType, content: string) => void;
	onLikeItem: (itemId: string) => void;
}

export const RetroColumn = ({
	title,
	type,
	items,
	onAddItem,
	onLikeItem,
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
