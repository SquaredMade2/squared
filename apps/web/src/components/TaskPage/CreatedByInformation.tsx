import { useEventStore, useTaskStore, useUserStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { formatDate } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const CreatedByInformation = () => {
	const { users } = useUserStore((state) => state);
	const events = useEventStore((state) => state.events);
	const currentTask = useTaskStore((state) => state.currentTask);
	const authorId = currentTask?.authorId;
	const foundUser = users.find((user) => user.externalId === authorId);

	const displayDate = () => {
		if (currentTask) {
			// Assigning it as a new Date automatically makes it a local date
			const currentTaskDate = currentTask.dateCreated;
			const formattedDate = formatDate(currentTaskDate, "dd MMM yyyy");
			return formattedDate;
		}
	};

	return (
		<div className="flex flex-col gap-2">
			{/* Events */}
			{events
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				)
				.map((event) => {
					const eventAuthor = users.find(
						(user) => user.externalId === event.authorId,
					);
					return (
						<div key={event.id} className="flex items-center px-8">
							<div className="mr-4 text-muted-foreground">
								{formatDate(new Date(event.createdAt), "dd MMM yyyy")}
							</div>
							<Avatar className="size-6 text-xxs">
								<AvatarImage src={eventAuthor?.avatarUrl ?? ""} />
								<AvatarFallback>
									{getInitials(eventAuthor?.name)}
								</AvatarFallback>
							</Avatar>
							<p className="mr-4 ml-2 text-foreground">
								{eventAuthor?.name || "Unknown Author"}
							</p>
							<p className="text-muted-foreground text-sm">{event.message}</p>
						</div>
					);
				})}
			{/* Created by information */}
			<div className="flex items-center px-8">
				<div className="mr-4 text-muted-foreground">{displayDate()}</div>
				<Avatar className="size-6 text-xxs">
					<AvatarImage src={foundUser?.avatarUrl ?? ""} />
					<AvatarFallback>{getInitials(foundUser?.name)}</AvatarFallback>
				</Avatar>
				<p className="mr-4 ml-2 text-foreground">{foundUser?.name}</p>
				<p className="text-muted-foreground text-sm">created the task</p>
			</div>
		</div>
	);
};
