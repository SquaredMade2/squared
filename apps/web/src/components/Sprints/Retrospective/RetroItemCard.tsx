import type { RetroItem } from "@/app/[workspace]/(main)/team/[identifier]/sprints/[sprintId]/retrospective/page";
import { useUsers } from "@/hooks/useUsers";
import { client } from "@/lib/client";
import { formatName } from "@/utils/formatting";
import { useUser } from "@clerk/nextjs";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, ThumbsUp, Trash } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent } from "@squaredmade/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import type { EditContent } from "./RetroColumn";

export const RetroItemCard = ({
	item,
	index,
	setIsEditItem,
	setEditContent,
	setIsModalOpen,
	onLikeItem,
	liked,
}: {
	item: RetroItem;
	index: number;
	setIsEditItem: Dispatch<SetStateAction<boolean>>;
	setEditContent: Dispatch<SetStateAction<EditContent>>;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	onLikeItem: (itemId: string) => void;
	liked: boolean;
}) => {
	const { user } = useUser();
	const { users } = useUsers();
	const author = users?.find((u) => u.userId === item.authorId);

	const handleRetroItemEdit = () => {
		setIsEditItem(true);
		setEditContent({ retrospectiveItemId: item.id, content: item.content });
		setIsModalOpen(true);
	};

	const likedByUsers = item.likes
		.map((id) => users?.find((u) => u.userId === id))
		.map((u) => formatName(u))
		.join(", ");

	const { mutate: handleItemDeletion } = useMutation({
		mutationKey: ["delete-retro-item"],
		mutationFn: async () => {
			await client.sprint.deleteRetroItem.$post({
				retrospectiveItemId: item.id,
			});
		},
		onSuccess: () => {
			toast.success("Item Deleted", {
				description: "Retro item has been successfully deleted",
			});
		},
		onError: (error) => {
			toast.error("Error deleting item", {
				description: error.message,
			});
		},
	});

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
							<div className="flex gap-1">
								{user?.id === item.authorId && (
									<>
										<Button
											className="p-2 text-green-700 hover:bg-transparent hover:text-green-700/65"
											variant={"ghost"}
											title="Edit Item"
											onClick={handleRetroItemEdit}
										>
											<Pencil />
										</Button>
										<Button
											className="p-2 text-red-500 hover:bg-transparent hover:text-red-500/65"
											variant={"ghost"}
											title="Delete Item"
											onClick={() => handleItemDeletion()}
										>
											<Trash />
										</Button>
									</>
								)}
								{author && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant={liked ? "secondary" : "outline"}
													className="gap-2"
													onClick={() => onLikeItem(item.id)}
													disabled={user?.id === item.authorId}
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
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</Draggable>
	);
};
