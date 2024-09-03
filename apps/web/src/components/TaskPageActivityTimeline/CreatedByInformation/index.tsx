import React from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import ProfileImage from "@/components/ProfileImage";
import { parseISO } from "date-fns/parseISO";
import { formatDate } from "date-fns/format";

const CreatedByInformation = () => {
	const { authorName, authorId, createdAt } = useAppSelector(
		(state) => state.events.taskEventLog,
	);
	const displayDate = () => {
		if (createdAt) {
			const date = parseISO(createdAt.toLocaleDateString());
			const formattedDate = formatDate(date, "dd MMM yyyy");
			return formattedDate;
		}
	};

	return (
		<div className="flex items-center px-8">
			<div className="mr-4 text-muted-foreground">{displayDate()}</div>
			<ProfileImage profileName={authorName} location={"activityItem"} />
			<p className="text-foreground ml-2 mr-4">{authorName}</p>
			<p className="text-sm text-muted-foreground">created the issue</p>
		</div>
	);
};

export default CreatedByInformation;
