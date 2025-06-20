import type { PublicUserData } from "@clerk/types";
import { type Label, Priority, Status } from "@squaredmade/db";
import { format } from "date-fns";
import type { FilterCondition } from "@/store/filters";
import { getFilterAssignees } from "@/store/filters/helpers";

export const truncateString = (string: string, maxLength: number): string => {
	if (string.length > maxLength) {
		let lastSpace = string.lastIndexOf(" ", maxLength);
		if (lastSpace === -1) lastSpace = maxLength;
		return `${string.substring(0, lastSpace)}...`;
	}
	return string;
};

export const sanitizeBranchName = (str: string): string => {
	const excludedWords = new Set([
		"the",
		"of",
		"and",
		"to",
		"in",
		"on",
		"with",
		"for",
		"a",
		"an",
		"that",
		"eg",
		"like",
	]);

	const sanitized = str
		.toLowerCase()
		.replace(/[^a-z0-9\s/]/g, "")
		.split(/[\s/]+/)
		.filter((word) => word && !excludedWords.has(word))
		.slice(0, 8)
		.join("-");

	return sanitized;
};

export const handleWorkspaceNameOverflow = (workspaceName: string | null) => {
	return typeof workspaceName === "string" && workspaceName.length > 20
		? `${workspaceName.slice(0, 20)}...`
		: workspaceName;
};

export const formatName = (user: PublicUserData | undefined): string => {
	if (!user) return "Unknown User";
	return `${user.firstName} ${user?.lastName}`;
};

export const getInitials = (name?: string | null): string => {
	if (!name || typeof name !== "string") return "";

	const words = name.trim().split(/\s+/);

	const initials = words
		.map((word) => word.charAt(0).toUpperCase())
		.filter(Boolean)
		.slice(0, 2);

	return initials.join("");
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
		case Status.duplicated:
			return "Duplicated";
		case Status.archived:
			return "Archived";
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

// TODO: Implement formatting link
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

export const formatFilterName = async (
	filter: FilterCondition,
	labels: Label[],
	users: PublicUserData[],
): Promise<{ name: string; value: string }> => {
	if (!filter.value) return { name: filter.field, value: "" };
	switch (filter.field) {
		case "assigneeId": {
			const assignees = getFilterAssignees([filter], users);
			return {
				name: assignees.length > 1 ? "Assignees" : "Assignee",
				value: assignees
					.map((a) => formatName(a ?? undefined) || "Unassigned")
					.join(", "),
			};
		}
		case "status":
			if (Array.isArray(filter.value)) {
				const formattedStatuses = filter.value
					.map((status) => formatStatus(status as Status))
					.join(", ");
				return { name: "Status", value: formattedStatuses };
			}
			return {
				name: "Status",
				value: formatStatus(filter.value as Status),
			};

		case "priority":
			if (Array.isArray(filter.value)) {
				const formattedPriorities = filter.value
					.map((priority) => formatPriority(priority as Priority))
					.join(", ");
				return { name: "Priority", value: formattedPriorities };
			}
			return {
				name: "Priority",
				value: formatPriority(filter.value as Priority),
			};
		case "dueDate":
			return {
				name: "Due Date",
				value:
					filter.value instanceof Date
						? `${filter.operator} ${format(filter.value, "MMM d, yyyy")}`
						: filter.value.toLocaleString(),
			};
		case "effortEstimate":
			return {
				name: "Effort Estimate",
				value: filter.value.toLocaleString(),
			};
		case "labels": {
			const filteredLabels = labels.filter(
				(l) => Array.isArray(filter.value) && filter.value.includes(l.name),
			);
			return {
				name:
					filteredLabels?.length && filteredLabels.length > 1
						? "Labels"
						: "Label",
				value: filteredLabels?.map((l) => l.name).join(", ") ?? "",
			};
		}
		default:
			return { name: filter.field, value: filter.value.toLocaleString() };
	}
};

export const verifyUrlFormat = (url: string): string | boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};
