import type { Task } from "@squared/db";
import type { BaseSelection, Node, NodeEntry } from "slate";

import type { JSX } from "react";

export interface TextEditorProps {
	task: Task;
}

export interface TextEditorToolBarProps {
	// Leafs
	createLeaf: (markType: MarkTypes) => void;
	markActiveChecks: MarkActives;
	injectLinkContent: (linkName: string, linkUrl: string) => void;
	injectImgContent: (img: File) => void;

	// Blocks

	createHeaderBlock: () => void;
	isElementActive: (elementType: ElementTypes) => NodeEntry<Node> | undefined;

	// Others

	selection: BaseSelection;
}

export interface LinkModalProps {
	injectLinkContent: (linkName: string, linkUrl: string) => void;
	selection: BaseSelection;
}

export interface ImgModalProps {
	injectImgContent: (img: File) => void;
}

export type MarkActives = {
	isBoldActive: () => boolean;
	isItalicActive: () => boolean;
	isCodeActive: () => boolean;
	isLinkActive: () => boolean;
};

export type CustomElementAttributes = Omit<
	JSX.IntrinsicElements["div"],
	"children"
> & {
	ref?: React.RefObject<HTMLDivElement | null>;
	"data-slate-node"?: string;
};

export type CustomElement = {
	type: ElementTypes;
	children: CustomText[];
	attributes?: CustomElementAttributes;
};

export type CustomText = {
	text: string;
	bold?: boolean;
	italic?: boolean;
	code?: boolean;
	url?: string;
	img?: boolean;
};

export type MarkTypes = keyof Omit<CustomText, "text">;

export type ElementTypes = "paragraph" | "header" | "img";

export type CustomDescendant = CustomElement | CustomText;
