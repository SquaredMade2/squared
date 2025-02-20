import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatName } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import { Draggable } from "@hello-pangea/dnd";
import { ThumbsUp } from "@squared/icons";
import { TooltipContent } from "@squaredmade/ui/tooltip";

export const RetroItemCard = ({
	item,
	index,
	onLikeItem,
}: {
	item: RetroItem;
	index: number;
	onLikeItem: (itemId: string) => void;
}) => {
	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);
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
							<div className="flex flex-col">
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
