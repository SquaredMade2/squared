import type { PublicUserData } from "@clerk/types";
import type {
	CSSProperties,
	Dispatch,
	JSX,
	MutableRefObject,
	SetStateAction,
} from "react";
import type { BaseSelection, Editor, Node, NodeEntry } from "slate";

export interface TextEditorProps {
	placeholder?: string;
	onBlur?: React.FocusEventHandler<HTMLDivElement>;
	onFocus?: React.FocusEventHandler<HTMLDivElement>;
	onChange?: (value: CustomDescendant[]) => void;
	style?: CSSProperties | undefined;
	value?: CustomDescendant[];
	hasToolbar?: boolean;
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
	setCurrentEnterUser: Dispatch<SetStateAction<PublicUserData | null>>;
	setToggleMentions: Dispatch<SetStateAction<boolean>>;
	debounceRef: MutableRefObject<boolean>;
}
export interface TextEditorTasksProps {
	cursorPosition: { x: number; y: number } | null;
	editor: Editor;
	setCurrentEnterUser: Dispatch<SetStateAction<PublicUserData | null>>;
	setToggleTasks: Dispatch<SetStateAction<boolean>>;
	debounceRef: MutableRefObject<boolean>;
}

export interface MentionHoverProps {
	mentionedUser: PublicUserData;
}

export type MarkActives = {
	isBoldActive: () => boolean;
	isItalicActive: () => boolean;
	isCodeActive: () => boolean;
	isLinkActive: () => boolean;
	isUnderlineActive: () => boolean;
	isMentionActive: () => boolean;
	isTaskActive: () => boolean;
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
	underline?: boolean;
	taskConfirm?: boolean;
	mentionConfirm?: PublicUserData;
};

export type MarkTypes = keyof Omit<CustomText, "text">;

export type CustomDescendant = CustomElement | CustomText;
