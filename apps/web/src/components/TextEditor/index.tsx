import type { PublicUserData } from "@clerk/types";
import { toast } from "@squaredmade/ui/toast";
import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import type { BaseEditor, Descendant } from "slate";
import { createEditor, Editor, Element, Transforms } from "slate";
import type {
	ReactEditor,
	RenderElementProps,
	RenderLeafProps,
} from "slate-react";
import { DefaultElement, Editable, Slate, withReact } from "slate-react";
import { useModalStore } from "@/store";
import {
	clearCurrentLeafContent,
	getMentionFromLeaf,
	injectMentionConfirm,
} from "@/utils/textEditorSelection";
import type {
	CustomDescendant,
	CustomElement,
	CustomText,
	MarkTypes,
	TextEditorProps,
} from "./interfaces";
import TextEditorMentions from "./Menus/TextEditorMentions";
import TextEditorTasks from "./Menus/TextEditorTasks";
import HeaderElement from "./TextEditorElements/ElementBlocks/HeaderElement";
import CodeLeaf from "./TextEditorElements/LeafBlocks/CodeLeaf";
import Leaf from "./TextEditorElements/LeafBlocks/Leaf";
import TextEditorToolBar from "./TextEditorToolBar";

declare module "slate" {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

export const initialEditorValue: CustomDescendant[] = [
	{
		children: [{ text: "" }],
		type: "paragraph",
	},
];

const defaultSelectionRange = {
	anchor: { offset: 0, path: [0, 0] },
	focus: { offset: 0, path: [0, 0] },
};

const TextEditor = ({
	placeholder,
	style,
	onBlur,
	onFocus,
	onChange,
	value = initialEditorValue,
	hasToolbar = true,
}: TextEditorProps) => {
	const { setShowLinkForm } = useModalStore((state) => state);
	// Initialize Slate text editor
	const [editor] = useState(() => withReact(createEditor()));

	const [toggleMentions, setToggleMentions] = useState(false);
	const [toggleTask, setToggleTask] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	// Mention search filter
	const [mentionsFilter, setMentionsFilter] = useState("");
	const [currentEnterUser, setCurrentEnterUser] =
		useState<PublicUserData | null>(null);
	const [editorValue, setEditorValue] = useState<CustomDescendant[]>(value);

	const debounceRef = useRef(false);
	const editorRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setEditorValue(value);
	}, [value]);

	useEffect(() => {
		if (checkIfSlateEmpty(editor)) {
			editor.children = initialEditorValue;
			Transforms.select(editor, defaultSelectionRange);
			return;
		}

		if (editorValue.length === 0 || editorValue === initialEditorValue) {
			editor.children = initialEditorValue;
			Transforms.select(editor, defaultSelectionRange);
		}
	}, [editorValue]);

	const handleCharKeyUp = (event: KeyboardEvent) => {
		if (event.key === "@" || event.key === "#") {
			const selection = window.getSelection();
			if (!selection) {
				setPosition({ x: 0, y: 0 });
				return;
			}
			if (!selection.rangeCount) {
				setPosition({ x: 0, y: 0 });
				return;
			}

			const { left } = editorRef.current
				? editorRef.current.getBoundingClientRect()
				: { left: 0 };

			const range = selection.getRangeAt(0).cloneRange();
			const rect = range.getBoundingClientRect();
			setPosition({
				x: rect.left - left,
				y: rect.top,
			});
		}
	};

	const injectLinkContent = (linkName: string, linkUrl: string) => {
		if (!(linkName && linkUrl)) return;
		if (!editor.selection) {
			toast.error("Place text cursor", {
				description:
					"Place a text cursor in the designated area to insert the link",
			});
			return;
		}
		const linkNode = { text: linkName, url: linkUrl };
		Transforms.insertNodes(editor, linkNode);
	};

	// Helper Functions

	const checkIfSlateEmpty = (editor: BaseEditor & ReactEditor) => {
		const editorContent = editor.children.reduce(
			(accRow: string, nextRow: Descendant) => {
				if ("children" in nextRow) {
					const flattenedRow = nextRow.children.reduce(
						(accLeaf: string, nextLeaf: CustomText) => accLeaf + nextLeaf.text,
						"",
					);
					return accRow + flattenedRow;
				}
				return accRow + nextRow.text;
			},
			"",
		);
		return editorContent.length === 0;
	};

	const isHeaderBlock = () => {
		// return if the block exists in the highlighted area
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "header",
		});
		return match;
	};

	// Create Element Blocks (Entire Row)
	const createHeaderBlock = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "header",
		});

		Transforms.setNodes(
			editor,
			{ type: match ? "paragraph" : "header" },
			{ match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
		);
	};

	// Create Leafs (Portion of Row)

	const getActiveLeaf = (markType: MarkTypes) => {
		switch (markType) {
			case "bold":
				return "isBoldActive";
			case "italic":
				return "isItalicActive";
			case "underline":
				return "isUnderlineActive";
			case "code":
				return "isCodeActive";
			case "mention":
				return "isMentionActive";
			case "mentionConfirm":
				return "isMentionConfirmActive";
			case "taskConfirm":
				return "isTaskActive";
			case "url":
				return "isLinkActive";
		}
	};

	const isMarkActive = (type: MarkTypes): boolean => {
		if (!editor.selection) return false;
		const marks = Editor.marks(editor);
		return type === "url" || type === "mentionConfirm"
			? !!marks?.[type]
			: Boolean(marks?.[type]);
	};

	const getEditorMarks = () => ({
		isBoldActive: () => isMarkActive("bold"),
		isCodeActive: () => isMarkActive("code"),
		isItalicActive: () => isMarkActive("italic"),
		isLinkActive: () => isMarkActive("url"),
		isMentionActive: () => isMarkActive("mention"),
		isMentionConfirmActive: () => isMarkActive("mentionConfirm"),
		isTaskActive: () => isMarkActive("taskConfirm"),
		isUnderlineActive: () => isMarkActive("underline"),
	});

	const createLeaf = (
		markType: MarkTypes,
		markState = !getEditorMarks()[getActiveLeaf(markType)](),
	) => {
		Editor.addMark(editor, markType, markState);
	};

	const handleSetEditorContent = (e: KeyboardEvent<HTMLDivElement>) => {
		// !!! Each if needs a prevent default, because it prevents it from edge case where if you do
		//     ctrl <something>, you dont want to add the character <something> in while doing a shortcut
		// !!!
		handleCommandComponentOnKey(e.key);
		const ifMac = navigator.userAgent.indexOf("Mac") !== -1;
		const universalHotKey = ifMac ? "metaKey" : "ctrlKey";
		if (isMarkActive("url")) {
			Editor.removeMark(editor, "url");
		}
		if (isMarkActive("mentionConfirm") && e.key !== "Backspace") {
			Editor.removeMark(editor, "mentionConfirm");
		}

		switch (e.key) {
			// Element Blocks

			// Submit Mention

			case "Enter": {
				if (toggleMentions) {
					e.preventDefault();
					debounceRef.current = true;
					if (currentEnterUser) injectMentionConfirm(editor, currentEnterUser);
					setToggleMentions(false);
				}
				break;
			}

			case "Backspace": {
				if (isMarkActive("mentionConfirm")) {
					clearCurrentLeafContent(editor);
				}
				break;
			}

			case "@": {
				createLeaf("mention", true);
				break;
			}

			case "#": {
				createLeaf("taskConfirm", true);
				break;
			}

			case "`": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createLeaf("code");
				}
				break;
			}

			case "h": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createHeaderBlock();
				}
				break;
			}

			// Leafs

			case "b": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createLeaf("bold");
				}
				break;
			}
			case "i": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createLeaf("italic");
				}
				break;
			}
			case "u": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createLeaf("underline");
				}
				break;
			}
			case "l": {
				if (e[universalHotKey]) {
					e.preventDefault();
					setShowLinkForm(true);
				}
				break;
			}
		}
	};

	// Render Functions

	// A leaf is basically a chunk of text that is different compared to the rest of the Element Block. For example a bold
	// An element block would be an entire row, but a leaf would be a portion of an element block
	const renderLeaf = useCallback((props: RenderLeafProps) => {
		return <Leaf {...props} />;
	}, []);

	// For each CustomElement type, render a different element node depending on what the type of block it is
	const renderElement = useCallback((props: RenderElementProps) => {
		switch (props.element.type) {
			case "header":
				return <HeaderElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	// Effects

	useEffect(() => {
		editor.selection = {
			anchor: { offset: 0, path: [0, 0] },
			focus: { offset: 0, path: [0, 0] },
		};
	}, []);

	function handleCommandComponentOnKey(key: string) {
		const deleteEntireMention = () => {
			if (getEditorMarks().isMentionActive()) {
				clearCurrentLeafContent(editor);
				createLeaf("mention", false);
				setToggleMentions(false);
			}
		};
		const allowEntireMention = () => {
			createLeaf("mention", true);
			setToggleMentions(true);
		};
		if (debounceRef.current) {
			debounceRef.current = false;
			return;
		}
		if (key === "@") {
			allowEntireMention();
		} else {
			deleteEntireMention();
		}
		if (toggleMentions) {
			setMentionsFilter(getMentionFromLeaf(editor));
		}

		setToggleTask(key === "#");
	}

	return (
		<Slate
			editor={editor}
			initialValue={editorValue}
			onChange={(newValue) => {
				setEditorValue(newValue);
				onChange?.(newValue); // Optional external onChange handler
			}}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: This is our wrapper for the textarea */}
			<div className="markdown-content" onKeyUp={handleCharKeyUp}>
				<div
					className={
						"min-h-[160px] w-full rounded-lg border border-input bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					}
				>
					{hasToolbar && (
						<TextEditorToolBar
							// Leafs

							createHeaderBlock={createHeaderBlock}
							createLeaf={createLeaf}
							injectLinkContent={injectLinkContent}
							// Blocks
							isHeaderBlock={isHeaderBlock()}
							markActiveChecks={getEditorMarks()}
							// Others
							selection={editor.selection}
						/>
					)}
					<div ref={editorRef}>
						<Editable
							className="min-h-[160px] w-full px-3 py-4"
							onBlur={onBlur}
							onFocus={onFocus}
							onKeyDown={handleSetEditorContent}
							placeholder={placeholder || ""}
							renderElement={renderElement}
							renderLeaf={renderLeaf}
							style={style}
						/>
					</div>
				</div>
			</div>

			{toggleMentions && (
				<TextEditorMentions
					cursorPosition={position}
					debounceRef={debounceRef}
					editor={editor}
					mentionsFilter={mentionsFilter}
					setCurrentEnterUser={setCurrentEnterUser}
					setToggleMentions={setToggleMentions}
				/>
			)}

			{toggleTask && (
				<TextEditorTasks
					cursorPosition={position}
					debounceRef={debounceRef}
					editor={editor}
					setCurrentEnterUser={setCurrentEnterUser}
					setToggleTasks={setToggleTask}
				/>
			)}
		</Slate>
	);
};

export default TextEditor;

export type {
	CustomDescendant,
	CustomElement,
	CustomElementAttributes,
	CustomText,
	LinkModalProps,
	MarkActives,
	MarkTypes,
	MentionHoverProps,
	TextEditorMentionsProps,
	TextEditorProps,
	TextEditorTasksProps,
	TextEditorToolBarProps,
} from "./interfaces";
export { CodeLeaf, HeaderElement, Leaf, TextEditorToolBar };
