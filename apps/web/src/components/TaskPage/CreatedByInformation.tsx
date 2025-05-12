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
		(user) => user.userId === currentTask?.authorId,
	);

	const formatDateSpans = (date: Date | string | null | undefined) => {
		if (!date) return null;
		const d = new Date(date);
		if (Number.isNaN(d.getTime())) return null;
		return (
			<>
				<span className="w-[2ch] text-right">{formatDate(d, "dd")}</span>
				<span className="w-[3ch] text-left">{formatDate(d, "MMM")}</span>
				<span className="w-[4ch] text-left">{formatDate(d, "yyyy")}</span>
			</>
		);
	};

	const displayDate = () => {
		if (!currentTask) return null;
		const currentDate = currentTask.dateCreated;
		return formatDateSpans(currentDate);
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
						return user.userId === event.authorId;
					});
					return (
						<div key={event.id} className="flex items-center px-8">
							<div className="mr-4 flex w-[10%] gap-1 text-left text-muted-foreground">
								{formatDateSpans(getEventTime(event))}
							</div>
							<div className="w-[5%]">
								<Avatar className="size-6 text-xxs">
									<AvatarImage src={eventAuthor?.imageUrl ?? ""} />
									<AvatarFallback>
										{getInitials(getName(eventAuthor))}
									</AvatarFallback>
								</Avatar>
							</div>
							<p className="mr-4 ml-2 w-[15%] text-foreground">
								{getName(eventAuthor)}
							</p>
							<p className="w-[70%] text-muted-foreground text-sm">
								{event.message}
							</p>
						</div>
					);
				})}
			{/* Created by information */}
			<div className="flex items-center px-8">
				<div className="mr-4 flex w-[10%] gap-1 text-left text-muted-foreground">
					{displayDate()}
				</div>

				<div className="w-[5%]">
					<Avatar className="size-6 text-xxs">
						<AvatarImage src={foundUser?.imageUrl ?? ""} />
						<AvatarFallback>{getInitials(getName(foundUser))}</AvatarFallback>
					</Avatar>
				</div>
				<p className="mr-4 ml-2 w-[15%] text-foreground">
					{getName(foundUser)}
				</p>
				<p className="w-[70%] text-muted-foreground text-sm">
					created the task
				</p>
			</div>
		</div>
	);
};
