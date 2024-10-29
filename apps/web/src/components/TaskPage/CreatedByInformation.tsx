// import { formatDate } from "date-fns/format";
// import { useActivityStore, useTaskStore, useUserStore } from "@/store";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { getInitials } from "@/utils/formatting";

// export const CreatedByInformation = () => {
// 	const eventLogs = useActivityStore((state) => state.events);

// 	const currentTask = useTaskStore((state) => state.currentTask);
// 	const authorName = eventLogs[0]?.taskEvent?.authorName ?? "";
// 	const authorId = currentTask?.authorId;
// 	const { users } = useUserStore((state) => state);
// 	const foundUser = users.find((user) => user.id === authorId);

// 	const displayDate = () => {
// 		if (currentTask) {
// 			// Assigning it as a new Date automatically makes it a local date
// 			const currentTaskDate = new Date("2024-09-11T21:14:27.222Z");
// 			const formattedDate = formatDate(currentTaskDate, "dd MMM yyyy");
// 			return formattedDate;
// 		}
// 	};

// 	return (
// 		<div className="flex items-center px-8">
// 			<div className="mr-4 text-muted-foreground">{displayDate()}</div>
// 			<Avatar className="size-6 text-xxs">
// 				<AvatarImage src={foundUser?.avatarUrl ?? ""} />
// 				<AvatarFallback>{getInitials(authorName)}</AvatarFallback>
// 			</Avatar>
// 			<p className="text-foreground ml-2 mr-4">{authorName}</p>
// 			<p className="text-sm text-muted-foreground">created the issue</p>
// 		</div>
// 	);
// };
