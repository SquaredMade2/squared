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

// Export it here instead of import from nextmdx bc doesnt support commonjs module
export type MDXRemoteSerializeResult<
	TScope = Record<string, unknown>,
	TFrontmatter = Record<string, unknown>,
> = {
	compiledSource: string;
	scope: TScope;
	frontmatter: TFrontmatter;
};

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
