import type { CustomDescendant } from "@/components/TextEditor";
import * as runtime from "react/jsx-runtime";
import type { MDXComponent } from "@/components/TextEditor/interfaces";
import { Status, Priority } from "@repo/db";
import * as z from "zod";

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
		"Password must contain at least on lowercase letter",
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

		// if there is a formatted piece of text
		if ("children" in line) {
			// for every leaf, or subtext that has format, format them as MDX
			const allLeafs = line.children.map((leaf) => {
				// helper vars
				const returnBoldMarks = leaf.bold ? "**" : "";
				const returnItalicMarks = leaf.italic ? "*" : "";
				// add new marks here, needs both left and right bc future might need them
				const leftSurrounderMark = `${returnItalicMarks}${returnBoldMarks}`;
				const rightSurrounderMark = `${returnItalicMarks}${returnBoldMarks}`;

				return `${leftSurrounderMark}${leaf.text}${rightSurrounderMark}`;
			});

			// Handle current block (each row can only have one block)
			const returnHeaderBlock = line.type === "header" ? "##" : "";
			const returnCodeBlock = line.type === "code" ? "```" : "";
			const leftSurrounderBlock = `${returnHeaderBlock}${returnCodeBlock}`;
			const rightSurrounderBlock = `${returnCodeBlock}`;
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

export const convertMDXStringToJSX = async (
	mdxString: string,
	components: MDXComponent,
) => {
	try {
		const { compile } = await import("@mdx-js/mdx");
		const mdxWithBr = mdxString.replace(/\n/g, "<br />");

		const compiledMDX = await compile(mdxWithBr, {
			outputFormat: "function-body",
		});

		// Ensure compiledMDX.value is a string
		let mdxCode = compiledMDX.value;

		// Check if it's a Uint8Array and decode it
		if (mdxCode instanceof Uint8Array) {
			const decoder = new TextDecoder("utf-8");
			mdxCode = decoder.decode(mdxCode);
		}

		const commentContent = new Function("React", "components", mdxCode)(
			runtime,
			components,
		);

		return commentContent?.default || commentContent;
	} catch (err) {
		console.error(err);
	}
};

// TODO: implement comment format ("**bolded**") to ({ type: 'bold', text: 'bolded' })
// export const handleFormatCommentToSlate = (commentStr) => {
// };
