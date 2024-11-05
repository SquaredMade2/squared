import type { Task } from "@squared/db";
import type { Node, NodeEntry } from "slate";

export interface TextEditorProps {
	task: Task;
}

export interface TextEditorToolBarProps {
	// Leafs
	createBoldLeaf: () => void;
	createItalicLeaf: () => void;
	createCodeLeaf: () => void;

	isBoldActive: boolean;
	isItalicActive: boolean;

	isCodeActive: boolean;

	// Blocks

	createHeaderBlock: () => void;
	isHeaderBlock: NodeEntry<Node>;
}

export interface LinkDropdownProps {
	children: React.ReactNode;
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
	code?: boolean;
	link?: string;
};

export type CustomDescendant = CustomElement | CustomText;
