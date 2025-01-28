import type { Task } from "@squared/db";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { BaseSelection, Node, NodeEntry } from "slate";
import type { Editor } from "slate";

import type { JSX } from "react";

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

export interface TextEditorMentionsProps {
	cursorPosition: { x: number; y: number } | null;
	mentionsFilter: string;
	editor: Editor;
	setCurrentEnterUser: Dispatch<SetStateAction<string>>;
	setToggleMentions: Dispatch<SetStateAction<boolean>>;
	debounceRef: MutableRefObject<boolean>;
}

export type MarkActives = {
	isBoldActive: () => boolean;
	isItalicActive: () => boolean;
	isCodeActive: () => boolean;
	isLinkActive: () => boolean;
	isMentionActive: () => boolean;
};

export type CustomElementAttributes = Omit<
	JSX.IntrinsicElements["div"],
	"children"
> & {
	ref?: React.RefObject<HTMLDivElement | null>;
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
	mention?: boolean;
	mentionConfirm?: boolean;
};

export type MarkTypes = keyof Omit<CustomText, "text">;

export type CustomDescendant = CustomElement | CustomText;
