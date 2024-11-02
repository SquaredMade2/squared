import type { FilterCondition } from "@/store/filters";
import { Status, Priority, type User, type Label } from "@squared/db";
import * as z from "zod";
import { format } from "date-fns";

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

export const getInitials = (name: string): string => {
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
