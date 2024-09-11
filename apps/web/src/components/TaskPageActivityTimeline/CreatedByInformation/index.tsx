import React from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import ProfileImage from "@/components/ProfileImage";
import { parseISO } from "date-fns/parseISO";
import { formatDate } from "date-fns/format";
import { useTaskStore } from "@/storeZ";

const CreatedByInformation = () => {
	const { authorName, authorId, createdAt } = useAppSelector(
		(state) => state.events.taskEventLog,
	);

	const currentTask = useTaskStore((state) => state.currentTask);
	if (currentTask) {
		console.log(currentTask.dateCreated);
	}

	// const displayDate = () => {
	// 	if (currentTask) {
	// 		const date = parseISO(currentTask.dateCreated.toLocaleDateString());
	// 		const formattedDate = formatDate(date, "dd MMM yyyy");
	// 		return formattedDate;
	// 	}
	// };

	return (
		<div className="flex items-center px-8">
			{/* <div className="mr-4 text-muted-foreground">{displayDate()}</div> */}
			<ProfileImage profileName={authorName} location={"activityItem"} />
			<p className="text-foreground ml-2 mr-4">{authorName}</p>
			<p className="text-sm text-muted-foreground">created the issue</p>
		</div>
	);
};

export default CreatedByInformation;
