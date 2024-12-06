import { Element, Transforms } from "slate";
import { Editor, type Editor as EditorType } from "slate";
import { Node, Range } from "slate";
import { ReactEditor } from "slate-react";

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

export const getCharacterBefore = (editor: EditorType) => {
	if (!editor.selection) {
		return "";
	}

	const { anchor, focus } = editor.selection;

	const start = anchor.offset < focus.offset ? anchor : focus;

	if (!(start.offset > 0)) {
		return "";
	}

	const node = Node.string(editor);
	const selectedText = node.substring(start.offset - 1);

	return selectedText;
};

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

export const getCursorPositionOnPage = (editor: EditorType) => {
	const { selection } = editor;

	if (!selection || !selection.anchor) return null;

	if (
		Editor.hasPath(editor, selection.anchor.path) &&
		Range.isCollapsed(selection)
	) {
		const domSelection = window.getSelection();
		if (!domSelection) {
			return null;
		}

		const range = document.createRange();
		const [parentNode, path] = Editor.parent(editor, [0, 0]);
		console.log(parentNode);
		const startNode = ReactEditor.toDOMNode(editor, parentNode);
		range.setStart(startNode, selection.anchor.offset);
		range.setEnd(startNode, selection.anchor.offset);

		const rect = range.getBoundingClientRect();
		console.log(rect);

		return { X: rect.left, y: rect.top };
	}

	return { x: 1, y: 1 };

	// const selection = window.getSelection();

	// if (!selection || selection.rangeCount === 0) {
	// 	return { x: 0, y: 0 }; // No active selection
	// }

	// const range = selection.getRangeAt(0);
	// const { startContainer, startOffset } = range;
	// console.log("startContainer", startContainer);
	// console.log("startOffset", startOffset);

	// return { startContainer, startOffset };
};
