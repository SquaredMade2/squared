import { commentService } from "@/lib/services";
import { useCommentStore, useModalStore, useUserStore } from "@/store";
import { cn } from "@/utils/cn";
import { handleFormatSlateToComment } from "@/utils/formatting";
import {
	clearCurrentLeafContent,
	getCommandFromLeaf,
	isValidCommandBlock,
} from "@/utils/textEditorSelection";
import { TODO } from "@squared/context";
import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import type { BaseEditor, Descendant } from "slate";
import { Editor, Element, Transforms, createEditor } from "slate";
import type {
	ReactEditor,
	RenderElementProps,
	RenderLeafProps,
} from "slate-react";
import { DefaultElement, Editable, Slate, withReact } from "slate-react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import TextEditorCommand from "./Menus/TextEditorCommand";
import HeaderElement from "./TextEditorElements/ElementBlocks/HeaderElement";
import CodeLeaf from "./TextEditorElements/LeafBlocks/CodeLeaf";
import Leaf from "./TextEditorElements/LeafBlocks/Leaf";
import TextEditorToolBar from "./TextEditorToolBar";
import type {
	CustomDescendant,
	CustomElement,
	CustomText,
	MarkTypes,
	TextEditorProps,
} from "./interfaces";

declare module "slate" {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

const initialValue: CustomDescendant[] = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

const TextEditor = ({ task }: TextEditorProps) => {
	// State

	const { setShowLinkForm } = useModalStore((state) => state);
	const setComments = useCommentStore((state) => state.setComments);
	const currentUser = useUserStore((state) => state.user);
	// Holding current content in editor
	const [editorContent, setEditorContent] = useState(initialValue);
	// Initialize Slate text editor
	const [editor] = useState(() => withReact(createEditor()));
	// Will use below for better slash command toggler
	const [toggleCommand, setToggleCommand] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	// command search filter
	const [commandFilter, setCommandFilter] = useState("");
	const editorRef = useRef<HTMLDivElement | null>(null);

	// Functions

	const addCommentToTask = async () => {
		try {
			if (currentUser && task) {
				if (checkIfSlateEmpty(editor)) {
					return;
				}
				const newComment = {
					comment: handleFormatSlateToComment(editorContent),
					authorId: currentUser.id,
					date: new Date(),
					taskId: task.id,
				};
				setComments(
					await commentService.addComment(TODO, { comment: newComment }),
				);
				setEditorContent([]);
				editor.children = [
					{
						type: "paragraph",
						children: [{ text: "" }],
					},
				];
				Transforms.select(editor, {
					anchor: { path: [0, 0], offset: 0 },
					focus: { path: [0, 0], offset: 0 },
				});
			} else {
				toast({
					title: "Error getting comments",
					description: "Could not find user data and current task",
					variant: "destructive",
				});
			}
		} catch (err) {
			throw new Error(`Could not find user data and current task: ${err}`);
		}
	};

	const injectLinkContent = (linkName: string, linkUrl: string) => {
		if (!(linkName && linkUrl)) return;
		if (!editor.selection) {
			toast({
				title: "Place text cursor",
				description:
					"Place a text cursor in the designated area to insert the link",
				variant: "destructive",
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

	const handleCommandKeyUp = (event: KeyboardEvent) => {
		if (event.key === "/") {
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
				y: rect.top,
				x: rect.left - left,
			});
		}
	};

	const executeCommand = (command: string) => {
		switch (command) {
			case "Bold": {
				clearCurrentLeafContent(editor);
				createLeaf("bold", true);
				break;
			}
			case "Italic": {
				clearCurrentLeafContent(editor);
				createLeaf("italic", true);
				break;
			}
			case "Code": {
				clearCurrentLeafContent(editor);
				createLeaf("code", true);
				break;
			}
			case "Header": {
				clearCurrentLeafContent(editor);
				createHeaderBlock();
				break;
			}
			default: {
				toast({
					title: "Invalid Command",
					description: "The inputted command is invalid",
					variant: "destructive",
				});
			}
		}
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

	const useLeafActive = (markType: MarkTypes) => {
		switch (markType) {
			case "bold":
				return "isBoldActive";
			case "italic":
				return "isItalicActive";
			case "code":
				return "isCodeActive";
			case "url":
				return "isLinkActive";
			case "command":
				return "isCommandActive";
		}
	};

	const isMarkActive = (type: MarkTypes): boolean => {
		if (!editor.selection) return false;
		const marks = Editor.marks(editor);
		return type === "url" ? !!marks?.[type] : Boolean(marks?.[type]);
	};

	const useEditorMarks = () => ({
		isBoldActive: () => isMarkActive("bold"),
		isItalicActive: () => isMarkActive("italic"),
		isCodeActive: () => isMarkActive("code"),
		isLinkActive: () => isMarkActive("url"),
		isCommandActive: () => isMarkActive("command"),
	});

	const createLeaf = (
		markType: MarkTypes,
		markState = !useEditorMarks()[useLeafActive(markType)](),
	) => {
		Editor.addMark(editor, markType, markState);
	};

	const handleSetEditorContent = (e: KeyboardEvent<HTMLDivElement>) => {
		// !!! Each if needs a prevent default, because it prevents it from edge case where if you do
		//     ctrl <something>, you dont want to add the character <something> in while doing a shortcut
		// !!!
		const ifMac = navigator.userAgent.indexOf("Mac") !== -1;
		const universalHotKey = ifMac ? "metaKey" : "ctrlKey";
		if (isMarkActive("url")) {
			Editor.removeMark(editor, "url");
		}

		switch (e.key) {
			// Submit Command

			case "Enter": {
				if (toggleCommand) {
					e.preventDefault();
					const currentCommand = getCommandFromLeaf(editor);
					executeCommand(currentCommand.slice(1));
				}
				break;
			}

			// Element Blocks

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
			case "l": {
				if (e[universalHotKey]) {
					e.preventDefault();
					setShowLinkForm(true);
				}
				break;
			}
			case "/": {
				createLeaf("command", true);
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
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 0 },
		};
	}, []);

	useEffect(() => {
		const deleteEntireLeaf = () => {
			if (useEditorMarks().isCommandActive()) {
				clearCurrentLeafContent(editor);
				createLeaf("command", false);
				setToggleCommand(false);
			}
		};
		const allowEntireLeaf = () => {
			createLeaf("command", true);
			setToggleCommand(true);
		};
		// check if first char of command leaf is a /, if isnt /, delete leaf.
		isValidCommandBlock(editor) ? allowEntireLeaf() : deleteEntireLeaf();
		if (toggleCommand) {
			setCommandFilter(getCommandFromLeaf(editor));
		}
	}, [editor.selection]);

	return (
		<Slate
			editor={editor}
			initialValue={initialValue}
			onChange={(newValue) => setEditorContent(newValue)}
		>
			<div onKeyUp={handleCommandKeyUp} className="markdown-content">
				<div
					className={cn(
						"min-h-[160px] w-full rounded-lg border border-input bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					)}
				>
					<TextEditorToolBar
						// Leafs

						createLeaf={createLeaf}
						markActiveChecks={useEditorMarks()}
						injectLinkContent={injectLinkContent}
						// Blocks
						createHeaderBlock={createHeaderBlock}
						isHeaderBlock={isHeaderBlock()}
						// Others
						selection={editor.selection}
					/>
					<div ref={editorRef}>
						<Editable
							onKeyDown={handleSetEditorContent}
							renderLeaf={renderLeaf}
							renderElement={renderElement}
							className="min-h-[160px] w-full py-4 px-3"
						/>
					</div>
				</div>
			</div>

			{toggleCommand && (
				<TextEditorCommand
					cursorPosition={position}
					commandFilter={commandFilter}
					editor={editor}
					executeCommand={executeCommand}
					setToggleCommand={setToggleCommand}
				/>
			)}
			<Button
				onClick={() => !checkIfSlateEmpty(editor) && addCommentToTask()}
				className={`ml-auto m-5 ${checkIfSlateEmpty(editor) && "bg-muted hover:bg-muted text-muted-foreground"}`}
			>
				Comment
			</Button>
		</Slate>
	);
};

export default TextEditor;

export { Leaf, TextEditorToolBar, HeaderElement, CodeLeaf };
export * from "./interfaces";
