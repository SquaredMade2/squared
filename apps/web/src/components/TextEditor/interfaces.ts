import type { Task } from "@squared/db";
import type { BaseSelection, Node, NodeEntry } from "slate";

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

	injectLinkContent: (linkName: string, linkUrl: string) => void;

	// Blocks

	createHeaderBlock: () => void;
	isHeaderBlock: NodeEntry<Node>;

	// Others

	selection: BaseSelection;
}

export interface LinkModalProps {
	injectLinkContent: (linkName: string, linkUrl: string) => void;
	selection: BaseSelection;
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
	attributes?: CustomElementAttributes;
};

export type CustomText = {
	text: string;
	bold?: boolean;
	italic?: boolean;
	code?: boolean;
	url?: string;
};

export type CustomDescendant = CustomElement | CustomText;
