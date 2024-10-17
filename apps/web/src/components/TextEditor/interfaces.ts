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

export interface MDXProviderProps {
	children: React.ReactNode;
	components?: Record<string, React.ElementType>;
}

export type MDXComponent = {
	CommentCardContent: (props: CommentCardContentProps) => React.ReactElement;
};

export interface CommentCardContentProps {
	children: React.ReactNode;
}

export type CustomDescendant = CustomElement | CustomText;
