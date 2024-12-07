import { Draggable, Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { RetrospectiveItem, RetrospectiveItemType } from "@squared/db";
import { ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import AddRetroItemModal from "./AddRetroItemModal";

type RetroItem = Pick<RetrospectiveItem, "id" | "content" | "type" | "upvotes">;

interface RetroColumnProps {
	title: string;
	type: RetrospectiveItemType;
	items: RetroItem[];
	onAddItem: (type: RetrospectiveItemType, content: string) => void;
	onUpvoteItem: (itemId: string, type: RetrospectiveItemType) => void;
}

export const RetroColumn = ({
	title,
	type,
	items,
	onAddItem,
	onUpvoteItem,
}: RetroColumnProps) => {
	console.log(items);
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
							{items.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<Card>
												<CardContent className="p-2 flex justify-between">
													<span className="self-center">{item.content}</span>
													<Button
														variant="ghost"
														className="gap-2 items-center"
														onClick={() => onUpvoteItem(item.id, item.type)}
													>
														<ThumbsUp className="h-4 w-4" />
														{item.upvotes}
													</Button>
												</CardContent>
											</Card>
										</div>
									)}
								</Draggable>
							))}
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
