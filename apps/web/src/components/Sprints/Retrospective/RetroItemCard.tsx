import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import { useUsers } from "@/hooks/useUsers";
import { formatName } from "@/utils/formatting";
import { Draggable } from "@hello-pangea/dnd";
import { ThumbsUp } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent } from "@squaredmade/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";

export const RetroItemCard = ({
	item,
	index,
	onLikeItem,
	liked,
}: {
	item: RetroItem;
	index: number;
	onLikeItem: (itemId: string) => void;
	liked: boolean;
}) => {
	const { users } = useUsers();
	const author = users?.find((u) => u.userId === item.authorId);

	const likedByUsers = item.likes
		.map((id) => users?.find((u) => u.userId === id))
		.map((u) => formatName(u))
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
							<div className="flex flex-col pr-2">
								<div>{item.content}</div>
								{author && (
									<div className="text-muted-foreground">
										{formatName(author)}
									</div>
								)}
							</div>
							{author && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant={liked ? "secondary" : "outline"}
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
