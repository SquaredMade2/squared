import type { RetroItem } from "@/app/[workspace]/team/[identifier]/sprints/[sprintId]/retrospective/page";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store";
import { Draggable } from "@hello-pangea/dnd";

export const RetroItemCard = ({
	item,
	index,
}: { item: RetroItem; index: number }) => {
	const { users } = useUserStore((state) => state);
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
							<div className="flex flex-col">
								<div>{item.content}</div>
								{author && (
									<div className="text-muted-foreground">{author.name}</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</Draggable>
	);
};
