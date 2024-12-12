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
export const isValidCommandBlock = (editor: EditorType) => {
	const { selection } = editor;

	if (!selection) return false;

	const block = Editor.above(editor, {
		match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
	}) || [null];

	if (!block || block[0] === null) return false;

	const [node] = block;

	const text = Node.string(node);

	return text.startsWith("/");
};

export const getCommandFromLeaf = (editor: EditorType) => {
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
