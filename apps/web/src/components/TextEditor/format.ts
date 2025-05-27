import type { PublicUserData } from "@clerk/types";
import type { CustomElement, CustomText } from "./interfaces";

function findSlateCodeBlock(slateArr: CustomElement[], startIndex: number) {
	const codeLines: string[] = [];
	let i = startIndex;

	for (; i < slateArr.length; i++) {
		const currentIsCodeLine = slateArr[i]?.children?.every(
			(item) => item.code === true,
		);

		if (!currentIsCodeLine) break;
		codeLines.push(slateArr[i]?.children.map((leaf) => leaf.text).join(""));
	}

	return { codeLines, nextIndex: i };
}

export const convertSlateToMDX = (slateArr: CustomElement[]): string => {
	if (slateArr.length === 0) return "";
	const lines: string[] = [];
	let i = 0;

	while (i < slateArr.length) {
		const line = slateArr[i];
		const isCodeLine = line.children.every((item) => item.code === true);
		if (isCodeLine) {
			const { codeLines, nextIndex } = findSlateCodeBlock(slateArr, i);
			i = nextIndex;
			lines.push(`\`\`\`ts\n${codeLines.join("\n")}\n\`\`\``);
		} else {
			// Not a code block, process normally
			const lineStr = line.children
				.map((leaf) => {
					if (leaf.text === "") return "";
					if (leaf.url) return `[${leaf.text}](${leaf.url})`;
					if (leaf.mentionConfirm)
						return `<MentionHover mentionedUser={${JSON.stringify(leaf.mentionConfirm)}} />`;

					const bold = leaf.bold ? "**" : "";
					const italic = leaf.italic ? "*" : "";
					const code = leaf.code ? "`" : ""; // use single backtick for inline code
					const underlineStart = leaf.underline ? "<u>" : "";
					const underlineEnd = leaf.underline ? "</u>" : "";
					const formattedText = `${italic}${bold}${underlineStart}${code}${leaf.text.trim()}${code}${underlineEnd}${bold}${italic} `;
					return formattedText;
				})
				.join("");

			const prefix = line.type === "header" ? "### " : "";
			lines.push(prefix + lineStr);
			i++;
		}
	}
	return lines.join("\n\n");
};

function findMDXLines(text: string): string[] {
	// Split the text into parts, keeping the code blocks intact
	const parts = text.split(/(```[\s\S]*?\n```)/g);

	return parts.flatMap((part, i) => {
		if (i % 2 === 1) {
			// This is a code block, keep it as a whole string
			return [part];
		}
		// This is a regular text part, split it into paragraphs
		return part.split("\n\n");
	});
}

function splitText(text: string): string[] {
	return text
		.split(/(\*\*|\*|<u>|<\/u>|<MentionHover[^>]*\/>|\[.*?\]\(.*?\))/g)
		.filter((part) => part.trim() !== "");
}

function trackFormatting(parts: string[]): CustomText[] {
	const result: CustomText[] = [];

	let boldOn = false;
	let italicOn = false;
	let underlineOn = false;

	for (const part of parts) {
		if (part === "") continue;

		// Check for mention hover components
		if (part.startsWith("<MentionHover") && part.endsWith("/>")) {
			const mentionData = part.match(/mentionedUser=\{\{(.+?)\}\}/);
			if (!mentionData) continue;
			const cleaned = mentionData[1]
				.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Convert keys to "keys"
				.replace(/'/g, '"'); // Replace single quotes with double quotes if any

			try {
				const mentionUser = JSON.parse(`{${cleaned}}`) as PublicUserData;
				result.push({
					text: `@${mentionUser.firstName}` || "Error loading name",
					mentionConfirm: mentionUser,
				});
				continue;
			} catch (e) {
				console.error("Failed to parse mention data:", e);
			}
		}
		// Check for links in the format [text](url)
		if (part.startsWith("[") && part.includes("](")) {
			const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
			if (!linkMatch) continue;

			try {
				const linkData = {
					text: `${linkMatch[1]}`,
					url: linkMatch[2],
				};
				result.push(linkData);
				continue;
			} catch (e) {
				console.error("Failed to parse link data:", e);
			}
		}
		if (part === "***") {
			boldOn = !boldOn;
			italicOn = !italicOn;
		} else if (part === "**") {
			boldOn = !boldOn;
		} else if (part === "*") {
			italicOn = !italicOn;
		} else if (part === "<u>") {
			underlineOn = true;
		} else if (part === "</u>") {
			underlineOn = false;
		} else {
			const currentText: CustomText = { text: part };
			if (boldOn) currentText.bold = true;
			if (italicOn) currentText.italic = true;
			if (underlineOn) currentText.underline = true;
			result.push(currentText);
		}
	}

	return result;
}

function parseInlineMarkdown(text: string): CustomText[] {
	const parts = splitText(text);
	const formattedParts = trackFormatting(parts);
	return formattedParts;
}

export const convertMDXToSlate = (mdxString: string) => {
	const lines = findMDXLines(mdxString);
	const slateArr: CustomElement[] = [];

	for (const line of lines) {
		if (line.trim() === "") {
			slateArr.push({
				type: "paragraph",
				children: [{ text: "" }],
			});
		} else if (line.startsWith("```")) {
			const codeBlock = line.replace(/```/g, "").trim();
			slateArr.push({
				type: "code",
				children: [{ text: codeBlock, code: true }],
			});
		} else if (line.startsWith("### ")) {
			const headerText = line.replace("### ", "").trim();
			slateArr.push({
				type: "header",
				children: parseInlineMarkdown(headerText),
			});
		} else {
			const text = line.trim();
			slateArr.push({
				type: "paragraph",
				children: parseInlineMarkdown(text),
			});
		}
	}

	return slateArr;
};
