import { Draggable, Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { RetroItem } from "@/app/[workspace]/team/[identifier]/sprints/[sprintId]/retrospective/page";
import { useUserStore } from "@/store";
import type { RetrospectiveItemType } from "@squared/db";
import AddRetroItemModal from "./AddRetroItemModal";

interface RetroColumnProps {
	title: string;
	type: RetrospectiveItemType;
	items: RetroItem[];
	onAddItem: (type: RetrospectiveItemType, content: string) => void;
}

export const RetroColumn = ({
	title,
	type,
	items,
	onAddItem,
}: RetroColumnProps) => {
	const { users } = useUserStore((state) => state);

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
								const author = users.find((u) => u.id === item.authorId);
								return (
									<Draggable key={item.id} draggableId={item.id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<Card>
													<CardContent className="p-2">
														<div className="flex flex-col ">
															<div>{item.content}</div>
															<div className="text-muted-foreground ml-2">
																{author?.name}
															</div>
														</div>
													</CardContent>
												</Card>
											</div>
										)}
									</Draggable>
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
