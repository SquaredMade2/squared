import { formatDate } from "date-fns/format";
import { useActivityStore, useTaskStore } from "@/store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/utils/formatting";

export const CreatedByInformation = () => {
	const eventLogs = useActivityStore((state) => state.events);

	const authorName = eventLogs[0]?.taskEvent?.authorName ?? "";

	const currentTask = useTaskStore((state) => state.currentTask);

	const displayDate = () => {
		if (currentTask) {
			// Assigning it as a new Date automatically makes it a local date
			const currentTaskDate = new Date("2024-09-11T21:14:27.222Z");
			const formattedDate = formatDate(currentTaskDate, "dd MMM yyyy");
			return formattedDate;
		}
	};
	console.log(authorName);
	return (
		<div className="flex items-center px-8">
			<div className="mr-4 text-muted-foreground">{displayDate()}</div>
			<Avatar className="size-6 text-xxs">
				{/* will need to access users to retrieve avatarUrl */}
				{/* <AvatarImage src={}/> */}
				<AvatarFallback>{getInitials(authorName)}</AvatarFallback>
			</Avatar>
			<p className="text-foreground ml-2 mr-4">{authorName}</p>
			<p className="text-sm text-muted-foreground">created the issue</p>
		</div>
	);
};
