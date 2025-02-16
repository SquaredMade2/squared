import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import { TooltipContent } from "@squaredmade/ui/tooltip";
import { ThumbsUp } from "lucide-react";

export const RetroItemCard = ({
	item,
	index,
	onLikeItem,
}: {
	item: RetroItem;
	index: number;
	onLikeItem: (itemId: string) => void;
}) => {
	const { users } = useUserStore((state) => state);
	const author = users.find((u) => u.externalId === item.authorId);

	const likedByUsers = item.likes
		.map((id) => users.find((u) => u.externalId === id))
		.map((u) => u?.name)
		.join(", ");

	return (
		<Draggable key={item.id} draggableId={item.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<Card>
						<CardContent className="flex justify-between p-2">
							<div className="flex flex-col">
								<div>{item.content}</div>
								{author && (
									<div className="text-muted-foreground">{author.name}</div>
								)}
							</div>
							{author && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Button
												variant="outline"
												className="gap-2"
												onClick={() => onLikeItem(item.id)}
											>
												<ThumbsUp className="h-4 w-4" />
												{item.likes.length}
											</Button>
										</TooltipTrigger>
										{item.likes.length > 0 && (
											<TooltipContent>
												<span>{likedByUsers}</span>
											</TooltipContent>
										)}
									</Tooltip>
								</TooltipProvider>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</Draggable>
	);
};
