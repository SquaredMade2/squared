import type { Task } from "@squared/db";
import type { Dispatch, SetStateAction } from "react";
import type { BaseSelection, Editor, Node, NodeEntry } from "slate";

export interface TextEditorProps {
	task: Task;
}

export interface TextEditorToolBarProps {
	// Leafs
	createLeaf: (markType: MarkTypes) => void;
	markActiveChecks: MarkActives;
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

export interface TextEditorCommandProps {
	cursorPosition: { x: number; y: number } | null;
	commandFilter: string;
	editor: Editor;
	executeCommand: (command: string) => void;
	setToggleCommand: Dispatch<SetStateAction<boolean>>;
}

export type MarkActives = {
	isBoldActive: () => boolean;
	isItalicActive: () => boolean;
	isCodeActive: () => boolean;
	isLinkActive: () => boolean;
	isCommandActive: () => void;
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
	attributes?: CustomElementAttributes;
};

export type CustomText = {
	text: string;
	bold?: boolean;
	italic?: boolean;
	code?: boolean;
	url?: string;
	command?: boolean;
};

export type MarkTypes = keyof Omit<CustomText, "text">;

export type CustomDescendant = CustomElement | CustomText;
