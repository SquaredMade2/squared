import { eventService } from "@/lib/services";
import { useTaskStore, useUserStore, useEventStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { TaskEvent } from "@squared/db";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const CreatedByInformation = () => {
	const currentTask = useTaskStore((state) => state.currentTask);
	const authorId = currentTask?.authorId;
	const { users } = useUserStore((state) => state);
	const foundUser = users.find((user) => user.id === authorId);
	const events = useEventStore((state) => state.events);

	const displayDate = () => {
		if (currentTask) {
			const currentTaskDate = currentTask.dateCreated;
			const formattedDate = formatDate(
				new Date(currentTaskDate),
				"dd MMM yyyy",
			);
			return formattedDate;
		}
	};

	return (
		<>
			<div className="flex items-center px-8">
				<div className="mr-4 text-muted-foreground">{displayDate()}</div>
				<Avatar className="size-6 text-xxs">
					<AvatarImage src={foundUser?.avatarUrl ?? ""} />
					<AvatarFallback>{getInitials(foundUser?.name)}</AvatarFallback>
				</Avatar>
				<p className="text-foreground ml-2 mr-4">{foundUser?.name}</p>
				<p className="text-sm text-muted-foreground">created the task</p>
			</div>
			{events?.map((event) => {
				const eventAuthor = users.find((user) => user.id === event.authorId);
				return (
					<div key={event.id} className="flex items-center px-8 mt-4">
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
		</>
	);
};
