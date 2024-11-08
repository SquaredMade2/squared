import { commentService } from "@/lib/services";
import { useAuthStore, useCommentStore, useModalStore } from "@/store";
import { cn } from "@/utils/cn";
import { handleFormatSlateToComment } from "@/utils/formatting";
import { TODO } from "@squared/context";
import { type KeyboardEvent, useCallback, useState } from "react";
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
import HeaderElement from "./TextEditorElements/ElementBlocks/HeaderElement";
import CodeLeaf from "./TextEditorElements/LeafBlocks/CodeLeaf";
import Leaf from "./TextEditorElements/LeafBlocks/Leaf";
import TextEditorToolBar from "./TextEditorToolBar";
import type {
	CustomDescendant,
	CustomElement,
	CustomText,
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
	const currentUser = useAuthStore((state) => state.user);
	// Holding current content in editor
	const [editorContent, setEditorContent] = useState(initialValue);
	// Initialize Slate text editor
	const [editor] = useState(() => withReact(createEditor()));

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

	const isBoldActive = () => {
		const allMarks = Editor.marks(editor);
		return Boolean(allMarks?.bold);
	};

	const isItalicActive = () => {
		const allMarks = Editor.marks(editor);
		return Boolean(allMarks?.italic);
	};

	const isCodeActive = () => {
		const allMarks = Editor.marks(editor);
		return Boolean(allMarks?.code);
	};

	const isLinkActive = () => {
		const allMarks = Editor.marks(editor);
		if (allMarks?.url) {
			return true;
		}
		return false;
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

	const createBoldLeaf = () => {
		Editor.addMark(editor, "bold", Boolean(!isBoldActive()));
	};

	const createItalicLeaf = () => {
		Editor.addMark(editor, "italic", Boolean(!isItalicActive()));
	};

	const createCodeLeaf = () => {
		Editor.addMark(editor, "code", Boolean(!isCodeActive()));
	};

	const handleSetEditorContent = (e: KeyboardEvent<HTMLDivElement>) => {
		// !!! Each if needs a prevent default, because it prevents it from edge case where if you do
		//     ctrl <something>, you dont want to add the character <something> in while doing a shortcut
		// !!!
		const ifMac = navigator.userAgent.indexOf("Mac") !== -1;
		const universalHotKey = ifMac ? "metaKey" : "ctrlKey";
		if (isLinkActive()) {
			Editor.removeMark(editor, "url");
		}
		switch (e.key) {
			// Element Blocks

			case "`": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createCodeLeaf();
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
					createBoldLeaf();
				}
				break;
			}
			case "i": {
				if (e[universalHotKey]) {
					e.preventDefault();
					createItalicLeaf();
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

	return (
		<Slate
			editor={editor}
			initialValue={initialValue}
			onChange={(newValue) => setEditorContent(newValue)}
		>
			<div className="markdown-content">
				<div
					className={cn(
						"min-h-[160px] w-full rounded-lg border border-input bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					)}
				>
					<TextEditorToolBar
						// Leafs
						createBoldLeaf={createBoldLeaf}
						createItalicLeaf={createItalicLeaf}
						isBoldActive={isBoldActive()}
						isItalicActive={isItalicActive()}
						// Blocks
						createCodeLeaf={createCodeLeaf}
						isCodeActive={isCodeActive()}
						createHeaderBlock={createHeaderBlock}
						isHeaderBlock={isHeaderBlock()}
						injectLinkContent={injectLinkContent}
						// Others
						selection={editor.selection}
					/>
					<Editable
						onKeyDown={handleSetEditorContent}
						renderLeaf={renderLeaf}
						renderElement={renderElement}
						className="min-h-[160px] w-full py-4 px-3"
					/>
				</div>
			</div>
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
