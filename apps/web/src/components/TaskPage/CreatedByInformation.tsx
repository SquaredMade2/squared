import { useUsers } from "@/hooks/useUsers";
import { useEventStore, useTaskStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import type { PublicUserData } from "@clerk/types";
import type { GithubCommit, TaskEvent } from "@squaredmade/db";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { formatDate } from "date-fns";

export const CreatedByInformation = () => {
	const { users } = useUsers();
	const events = useEventStore((state) => state.events);
	const currentTask = useTaskStore((state) => state.currentTask);
	const foundUser = users?.find(
		(user?: PublicUserData) => user?.userId === currentTask?.authorId,
	);

	const displayDate = () => {
		if (currentTask) {
			// Assigning it as a new Date automatically makes it a local date
			const currentTaskDate = currentTask.dateCreated;
			const formattedDate = formatDate(currentTaskDate, "dd MMM yyyy");
			return formattedDate;
		}
	};

	const getEventTime = (event: TaskEvent | GithubCommit) => {
		if ("createdAt" in event) {
			return event.createdAt;
		}
		if ("timestamp" in event) {
			return event.timestamp;
		}
		throw new Error("Event does not have a timestamp or createdAt field");
	};

	const getName = (user?: PublicUserData) => {
		return user?.firstName
			? `${user.firstName} ${user.lastName}`
			: "Unknown User";
	};

	return (
		<div className="flex flex-col gap-2">
			{/* Events */}
			{events
				.sort(
					(a, b) =>
						new Date(getEventTime(b) || getEventTime(b)).getTime() -
						new Date(getEventTime(a) || getEventTime(a)).getTime(),
				)
				.map((event) => {
					const eventAuthor = users?.find((user) => {
						if (!("authorId" in event)) return false;
						return user?.userId === event.authorId;
					});
					return (
						<div
							key={event.id}
							className="grid grid-cols-17 items-center gap-x-1 px-8"
						>
							<div className="col-span-2 items-center break-words text-muted-foreground">
								{formatDate(getEventTime(event), "dd MMM yyyy")}
							</div>
							<div className="col-span-1">
								<Avatar className="size-6 text-xxs">
									<AvatarImage src={eventAuthor?.imageUrl ?? ""} />
									<AvatarFallback>
										{getInitials(getName(eventAuthor))}
									</AvatarFallback>
								</Avatar>
							</div>
							<p className="col-span-3 text-foreground">
								{getName(eventAuthor)}
							</p>
							<p className="col-span-11 text-muted-foreground text-sm">
								{event.message}
							</p>
						</div>
					);
				})}
			{/* Created by information */}
			<div className="grid grid-cols-17 items-center gap-x-1 px-8">
				<div className="col-span-2 items-center break-words text-muted-foreground">
					{displayDate()}
				</div>
				<div className="col-span-1">
					<Avatar className="size-6 text-xxs">
						<AvatarImage src={foundUser?.imageUrl ?? ""} />
						<AvatarFallback>{getInitials(getName(foundUser))}</AvatarFallback>
					</Avatar>
				</div>
				<p className="col-span-3 text-foreground">{getName(foundUser)}</p>
				<p className="col-span-11 text-muted-foreground text-sm">
					created the task
				</p>
			</div>
		</div>
	);
};
