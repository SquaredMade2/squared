import type { CustomDescendant, CustomElement } from "@/components/TextEditor";
import { Element, Transforms } from "slate";
import { Editor, type Editor as EditorType } from "slate";
import { Node, Range } from "slate";

// getting the current characters selected
export const getCharactersInSelection = (editor: EditorType) => {
	if (!editor.selection) {
		return "";
	}

	const { anchor, focus } = editor.selection;

	if (!Range.isCollapsed(editor.selection)) {
		const start = anchor.offset < focus.offset ? anchor : focus;
		const end = anchor.offset < focus.offset ? focus : anchor;

		const node = Node.string(editor);
		const selectedText = node.substring(start.offset, end.offset);

		return selectedText;
	}
	return "";
};

// check if the current command leaf has a "/" at the beginning of it
export const isValidMentionBlock = (editor: EditorType) => {
	const { selection } = editor;

	if (!selection) return false;

	const [node] = Editor.node(editor, selection, { edge: "start" });

	const text = Node.string(node);
	return text.startsWith("@");
};

export const getMentionFromLeaf = (editor: EditorType) => {
	const { selection } = editor;

	if (!selection) return "";

	const block = Editor.above(editor, {
		match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
	}) || [null];

	if (!block || block[0] === null) return "";

	const [node] = block;

	const text = Node.string(node);
	return text;
};

// clear the entire leaf's selected content from the editor
export const clearCurrentLeafContent = (editor: EditorType) => {
	const { selection } = editor;

	if (!selection) {
		return;
	}

	const [node, path] = Editor.node(editor, selection, { edge: "start" });

	if (typeof Node.string(node) !== "string") {
		return;
	}

	Transforms.insertText(editor, "", { at: path });
};

export const replaceTextOfCurrentNode = (
	editor: EditorType,
	newText: string,
) => {
	if (!editor.selection) return; // Ensure there's a selection
	const [, path] = Editor.node(editor, editor.selection);
	Transforms.select(editor, Editor.range(editor, path));

	// Insert new text
	Transforms.insertText(editor, newText);
};

export const injectMentionConfirm = (editor: EditorType, newText: string) => {
	if (!editor.selection) return; // Ensure there's a selection

	const [, path] = Editor.node(editor, editor.selection);
	Transforms.select(editor, Editor.range(editor, path));

	// Insert new text
	Transforms.insertNodes(editor, { text: `@${newText}`, mentionConfirm: true });
};

[
	{ type: "paragraph", children: [{ text: "@something", mention: true }] },
	{ type: "paragraph", children: [{ text: "@something", mention: true }] },
];

export const getMentionsFromSlate = (editorContent: CustomDescendant[]) => {
	const mentions = [];
	for (let i = 0; i < editorContent.length; i++) {
		const currentBlock = editorContent[i];
		if ("type" in currentBlock) {
			for (let j = 0; j < currentBlock.children.length; j++) {
				const currentLeaf = currentBlock.children[j];
				if (currentLeaf.mentionConfirm && currentLeaf.text.length > 0) {
					mentions.push(currentBlock.children[j].text.slice(1));
				}
			}
		}
	}
	return mentions;
};
