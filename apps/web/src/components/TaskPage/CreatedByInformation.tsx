import { useEventStore, useUserStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { formatDate } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const CreatedByInformation = () => {
	const { users } = useUserStore((state) => state);
	const events = useEventStore((state) => state.events);

	return (
		<div>
			{events.map((event) => {
				const eventAuthor = users.find((user) => user.id === event.authorId);
				return (
					<div key={event.id} className="flex items-center p-2">
						<div className="mr-4 text-muted-foreground">
							{formatDate(new Date(event.createdAt), "dd MMM yyyy")}
						</div>
						<Avatar className="size-6 text-xxs">
							<AvatarImage src={eventAuthor?.avatarUrl ?? ""} />
							<AvatarFallback>{getInitials(eventAuthor?.name)}</AvatarFallback>
						</Avatar>
						<p className="text-foreground ml-2 mr-4">
							{eventAuthor?.name || "Unknown Author"}
						</p>
						<p className="text-sm text-muted-foreground">{event.message}</p>
					</div>
				);
			})}
		</div>
	);
};
