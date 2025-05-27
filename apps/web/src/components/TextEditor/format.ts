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
					if (leaf.url) return `[${leaf.text}](${leaf.url})`;
					if (leaf.mentionConfirm)
						return `<MentionHover mentionedUser={${JSON.stringify(leaf.mentionConfirm)}} />`;

					const bold = leaf.bold ? "**" : "";
					const italic = leaf.italic ? "*" : "";
					const code = leaf.code ? "`" : ""; // use single backtick for inline code
					if (leaf.text === "") return "";
					return `${italic}${bold}${code}${leaf.text.trim()}${code}${bold}${italic} `;
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

function parseInlineMarkdown(text: string): CustomText[] {
	const result: CustomText[] = [];

	// Regex to match inline markdown patterns
	const regex = /(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+`)/g;

	let lastIndex = 0;
	// Iterate through all matches
	for (const match of text.matchAll(regex)) {
		if (match === null) break;
		if (match.index > lastIndex) {
			// Add plain text before match
			result.push({ text: text.slice(lastIndex, match.index) });
		}
		const token = match[0];
		if (token.startsWith("***")) {
			result.push({
				text: token.slice(3, -3),
				bold: true,
				italic: true,
			});
		} else if (token.startsWith("**")) {
			result.push({
				text: token.slice(2, -2),
				bold: true,
			});
		} else if (token.startsWith("*")) {
			result.push({
				text: token.slice(1, -1),
				italic: true,
			});
		} else if (token.startsWith("`")) {
			result.push({
				text: token.slice(1, -1),
				code: true,
			});
		}

		lastIndex = match.index + token.length;
	}

	if (lastIndex < text.length) {
		result.push({ text: text.slice(lastIndex) });
	}

	return result;
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
