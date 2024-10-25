import type { Node, NodeEntry } from "slate";
import type { Task } from "@repo/db";

export interface TextEditorProps {
	task: Task;
}

export interface TextEditorToolBarProps {
	// Leafs
	createBoldLeaf: () => void;
	createItalicLeaf: () => void;
	createCodeLeaf: (language: string) => void;

	isBoldActive: boolean;
	isItalicActive: boolean;

	isCodeActive: boolean;

	// Blocks

	createHeaderBlock: () => void;
	isHeaderBlock: NodeEntry<Node>;
}

export type CustomElementAttributes = Omit<
	JSX.IntrinsicElements["div"],
	"children"
> & {
	ref?: React.RefObject<HTMLDivElement>;
	"data-slate-node"?: string;
};

export type CustomElement = {
	type: string;
	children: CustomText[];
	url?: string;
	attributes?: CustomElementAttributes;
};

export type CustomText = {
	text: string;
	bold?: boolean;
	italic?: boolean;
	link?: boolean;
	// String for future, code block should be able to define what language, will implement in future
	code?: string;
};

export type CustomDescendant = CustomElement | CustomText;
