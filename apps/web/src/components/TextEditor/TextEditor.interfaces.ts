import type { ReactNode } from "react";
import type { Node, NodeEntry } from "slate";

export interface TextEditorToolBarProps {
	// Leafs
	createBoldLeaf: () => void;
	createItalicLeaf: () => void;

	isBoldActive: boolean;
	isItalicActive: boolean;

	// Blocks

	createCodeBlock: () => void;
	isCodeBlock: NodeEntry<Node>;

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
};

export type CustomDescendant = CustomElement | CustomText;

export type RenderProps = {
	element: CustomElement;
	attributes: string;
	children: ReactNode;
};
