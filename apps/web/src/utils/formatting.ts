import type { CustomDescendant } from "@/components/TextEditor";
import type { FilterCondition } from "@/store/filters";
import { type Label, Priority, Status, type User } from "@squared/db";
import { format } from "date-fns";
import * as z from "zod";

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
		.replace(/[^a-z0-9\s\/]/g, "")
		.split(/[\s\/]+/)
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

export const getInitials = (name?: string): string => {
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
export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(30, "Password must not exceed 30 characters")
	.refine((value) => !/\s/.test(value), "Password must not contain spaces")
	.refine(
		(value) => /[a-z]/.test(value),
		"Password must contain at least one lowercase letter",
	)
	.refine(
		(value) => /[A-Z]/.test(value),
		"Password must contain at least one capital letter",
	)
	.refine(
		(value) => /[0-9]/.test(value),
		"Password must contain at least one number",
	)
	.refine(
		(value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value),
		"Password must contain at least one special character",
	);

export const handleFormatSlateToComment = (slateArr: CustomDescendant[]) => {
	const arrOfFormattedLines = slateArr.map((line) => {
		// each formatted line/row
		const formattedLine = [];

		// if there is a formatted piece of text (this is for each subline of each row)
		if ("children" in line) {
			// for every leaf, or subtext that has format, format them as MDX
			const allLeafs = line.children.map((leaf) => {
				if (leaf.url) {
					return `[${leaf.text}](${leaf.url})`;
				}
				// helper vars
				const returnBoldMarks = leaf.bold ? "**" : "";
				const returnItalicMarks = leaf.italic ? "*" : "";
				const returnCodeMarks = leaf.code ? "```" : "";
				// add new marks here, needs both left and right bc future might need them
				const leftSurrounderMark = `${returnItalicMarks}${returnBoldMarks}${returnCodeMarks}`;
				const rightSurrounderMark = leftSurrounderMark;
				return `${leftSurrounderMark}${leaf.text}${rightSurrounderMark}`;
			});

			// Handle current block/row (each row can only have one block)
			const returnHeaderBlock = line.type === "header" ? "### " : "";
			const leftSurrounderBlock = `${returnHeaderBlock}`;
			// will need below for future formatting
			const rightSurrounderBlock = `${""}`;
			formattedLine.push(
				`${leftSurrounderBlock}${allLeafs.join("")}${rightSurrounderBlock}`,
			);
		} else {
			formattedLine.push(line.text);
		}

		return formattedLine.join("");
	});

	return arrOfFormattedLines.join("\n");
};

// TODO: implement comment format ("**bolded**") to ({ type: 'bold', text: 'bolded' })
// export const handleFormatCommentToSlate = (commentStr) => {
// };
export const formatFilterName = async (
	filter: FilterCondition,
	labels: Label[],
	users: User[],
): Promise<{ name: string; value: string }> => {
	if (!filter.value) return { name: filter.field, value: "" };
	switch (filter.field) {
		case "assigneeId": {
			const filteredUsers = users.filter(
				(u) => Array.isArray(filter.value) && filter.value.includes(u.id),
			);
			return {
				name:
					filteredUsers?.length && filteredUsers.length > 1 ? "Users" : "User",
				value: filteredUsers?.map((u) => u.name).join(", ") ?? "",
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
				(l) => Array.isArray(filter.value) && filter.value.includes(l.id),
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
