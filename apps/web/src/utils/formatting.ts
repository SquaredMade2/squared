import { Status, Priority } from "@repo/db";

export const truncateString = (string: string, maxLength: number): string => {
	if (string.length > maxLength) {
		let lastSpace = string.lastIndexOf(" ", maxLength);
		if (lastSpace === -1) lastSpace = maxLength;
		return `${string.substring(0, lastSpace)}...`;
	}
	return string;
};

export const replaceSpacesWithDashes = (str: string): string => {
	return str?.replace(/\s+/g, "-");
};

export const handleWorkspaceNameOverflow = (workspaceName: string | null) => {
	return typeof workspaceName === "string" && workspaceName.length > 20
		? `${workspaceName.slice(0, 20)}...`
		: workspaceName;
};

export const getInitials = (name: string) => {
	if (typeof name === "string") {
		const words = name.split(/(?=[A-Z])|\s+/);
		if (words.length === 1) {
			return name.substr(0, 2).toUpperCase();
		}
		const filteredWords = [words[0], words[1]];
		const initials = filteredWords.map((word) => word.charAt(0));
		return initials.join("").toUpperCase();
	}
};

export const formatUrl = (title: string) => {
	const titleSlug = title
		.toLowerCase()
		.replace(/'/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
	return titleSlug;
};

export const formatStatus = (status: Status) => {
	switch (status) {
		case Status.backlog:
			return "Backlog";
		case Status.todo:
			return "To Do";
		case Status.inProgress:
			return "In Progress";
		case Status.inReview:
			return "In Review";
		case Status.done:
			return "Done";
		case Status.canceled:
			return "Canceled";
		default:
			return "Backlog";
	}
};

export const formatPriority = (priority: Priority) => {
	switch (priority) {
		case Priority.noPriority:
			return "No priority";
		case Priority.urgent:
			return "Urgent";
		case Priority.high:
			return "High";
		case Priority.medium:
			return "Medium";
		case Priority.low:
			return "Low";
		default:
			return "No priority";
	}
};

// export const handleFormatLink = (url: string) => {
// // if is in url link format [nameOfLink]LinkUrl
// // return obj separating values
// // else return the original
// const linkFormat = /^\[(.+?)\](https?:\/\/[^\s]+)$/;
// const matchedFormat = url.match(linkFormat);
// if (matchedFormat) {
// 	return {
// 		full: matchedFormat[0],
// 		linkName: matchedFormat[1],
// 		linkUrl: matchedFormat[2],
// 		index: matchedFormat.index,
// 	};
// }
// return null;
// interface Match {
// 	full: string;
// 	linkName: string;
// 	linkUrl: string;
// 	index: number;
// }
// const linkFormat = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
// const links: Match[] = [];
// let match: RegExpExecArray | null;
// while ((match = linkFormat.exec(url)) !== null) {
// 	links.push({
// 		full: match[0],
// 		linkName: match[1],
// 		linkUrl: match[2],
// 		index: match.index,
// 	});
// }
// return links;
// };
