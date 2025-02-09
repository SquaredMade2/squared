import type {
	CustomDescendant,
	CustomElement,
	CustomText,
} from "@/components/TextEditor";
import {
	Editor,
	type Editor as EditorType,
	Element,
	Node,
	Range,
	Transforms,
} from "slate";

// getting the current characters selected
export const getCharactersInSelection = (editor: EditorType) => {
	if (!editor.selection || Range.isCollapsed(editor.selection)) return "";

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
	});

	if (!block || !block[0]) return "";

	const [node] = block;

	const text = Node.string(node);
	return text;
};

// clear the entire leaf's selected content from the editor
export const clearCurrentLeafContent = (editor: EditorType) => {
	const { selection } = editor;

	if (!selection) return;

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

export const getMentionsFromSlate = (
	editorContent: CustomDescendant[],
): string[] => {
	return editorContent
		.flatMap((block) =>
			"children" in block ? (block as CustomElement).children : [],
		)
		.filter((leaf: CustomText) => leaf.mentionConfirm && leaf.text.length > 0)
		.map((leaf: CustomText) => leaf.text.slice(1));
};
