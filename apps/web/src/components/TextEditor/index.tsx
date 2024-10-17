import { type KeyboardEvent, useCallback, useState } from "react";
import type { BaseEditor } from "slate";
import { Element, createEditor, Editor, Transforms } from "slate";
import type {
	ReactEditor,
	RenderElementProps,
	RenderLeafProps,
} from "slate-react";
import { Slate, Editable, withReact, DefaultElement } from "slate-react";
import type {
	CustomDescendant,
	CustomElement,
	CustomText,
	// TextEditorProps,
} from "./interfaces";
import { cn } from "@/utils/cn";
import CodeElement from "./TextEditorElements/ElementBlocks/CodeElement";
import Leaf from "./TextEditorElements/LeafBlocks/Leaf";
import TextEditorToolBar from "./TextEditorToolBar";
import HeaderElement from "./TextEditorElements/ElementBlocks/HeaderElement";
import { Button } from "../ui/button";
import { useAuthStore, useCommentStore } from "@/store";
import { toast } from "../ui/use-toast";
import { useTaskPageData } from "@/hooks/useTaskPageData";
import { handleFormatSlateToComment } from "@/utils/formatting";
// import { handleFormatLink } from "@/utils/formatting";

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

const TextEditor = () => {
	// State

	const addComment = useCommentStore((state) => state.addComment);
	const getComments = useCommentStore((state) => state.getAllComments);
	const currentUser = useAuthStore((state) => state.user);
	const { task } = useTaskPageData();
	// Holding current content in editor
	const [editorContent, setEditorContent] = useState(initialValue);
	// Initialize Slate text editor
	const [editor] = useState(() => withReact(createEditor()));

	// Functions

	const addCommentToTask = () => {
		const addNewComment = async () => {
			try {
				if (currentUser && task) {
					const newComment = {
						comment: handleFormatSlateToComment(editorContent),
						authorId: currentUser?.id,
						date: new Date(),
						taskId: task.id,
					};
					addComment(newComment);
					getComments(task.id);
				} else {
					toast({
						title: "Error getting comments",
						description: "Could not find user data and current task",
						variant: "destructive",
					});
				}
			} catch (err) {
				toast({
					title: "Error getting comments",
					description: String(err),
					variant: "destructive",
				});
			}
		};
		addNewComment();
	};

	// Helper Functions

	const isBoldActive = () => {
		const allMarks = Editor.marks(editor);
		if (allMarks?.bold) {
			return true;
		}
		return false;
	};

	const isItalicActive = () => {
		const allMarks = Editor.marks(editor);
		if (allMarks?.italic) {
			return true;
		}
		return false;
	};

	// const isLinkActive = () => {
	// 	const allMarks = Editor.marks(editor);
	// 	if (allMarks?.link) {
	// 		return true;
	// 	}
	// 	return false;
	// };

	const isCodeBlock = () => {
		// return if the block exists in the highlighted area
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "code",
		});
		return match;
	};

	const isHeaderBlock = () => {
		// return if the block exists in the highlighted area
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "header",
		});
		return match;
	};

	// Create Element Blocks (Entire Row)

	const createCodeBlock = () => {
		// check for if the text is currently a code block
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "code",
		});

		// Change the node, if isnt code block, make it one, vice versa
		Transforms.setNodes(
			editor,
			{ type: match ? "paragraph" : "code" },
			{ match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
		);
	};

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
		if (isBoldActive()) {
			Editor.addMark(editor, "bold", false);
		} else {
			Editor.addMark(editor, "bold", true);
		}
	};

	const createItalicLeaf = () => {
		if (isItalicActive()) {
			Editor.addMark(editor, "italic", false);
		} else {
			Editor.addMark(editor, "italic", true);
		}
	};

	// const createLinkLeaf = () => {
	// 	if (isLinkActive()) {
	// 		Editor.addMark(editor, "link", false);
	// 	} else {
	// 		Editor.addMark(editor, "link", true);
	// 	}
	// };

	const handleSetEditorContent = (e: KeyboardEvent<HTMLDivElement>) => {
		// !!! Each if needs a prevent default, because it prevents it from edge case where if you do
		//     ctrl <something>, you dont want to add the character <something> in while doing a shortcut
		// !!!

		switch (e.key) {
			// Element Blocks

			case "`": {
				if (e.ctrlKey) {
					e.preventDefault();
					createCodeBlock();
				}
				break;
			}

			case "h": {
				if (e.ctrlKey) {
					e.preventDefault();
					createHeaderBlock();
				}
				break;
			}

			// Leafs

			case "b": {
				if (e.ctrlKey) {
					e.preventDefault();
					createBoldLeaf();
				}
				break;
			}
			case "i": {
				if (e.ctrlKey) {
					e.preventDefault();
					createItalicLeaf();
				}
				break;
			}
			// case "o": {
			// 	if (e.ctrlKey) {
			// 		e.preventDefault();
			// 		createLinkLeaf();
			// 	}
			// 	break;
			// }
			case "Enter": {
				const { selection } = editor;
				if (selection) {
					// TODO: implement links with below
					// const content = Editor.string(editor, selection);
					// console.log(selection);
					// const link = handleFormatLink(content);
					// if (link) {
					// 	const textBeforeLink = content.slice(0, link.index);
					// 	const textAfterLink = content.slice(link.index, link.full.length);
					// 	Transforms.select(editor, {
					// 		anchor: { path: selection.anchor.path, offset: 0 },
					// 		focus: { path: selection.anchor.path, offset: content.length },
					// 	});
					// 	Transforms.insertText(editor, textBeforeLink);
					// 	Transforms.insertNodes(editor, {
					// 		type: "link",
					// 		url: link.linkUrl,
					// 		children: [{ text: link.linkName }],
					// 	});
					// 	Transforms.insertText(editor, textAfterLink);
					// }
					// console.log(link);
					// link.forEach(({ fullMatch, linkName, linkUrl, index }) => {
					// 	const textBeforeLink = content.slice(0, index);
					// 	const textAfterLink = content.slice(index + fullMatch.length);
					// 	Transforms.select(editor, {
					// 		anchor: { path: selection.anchor.path, offset: 0 },
					// 		focus: { path: selection.anchor.path, offset: content.length },
					// 	});
					// 	console.log("lol");
					// 	// Transforms.insertText(editor, textBeforeLink);
					// 	Transforms.insertNodes(editor, {
					// 		type: "link",
					// 		url: linkUrl,
					// 		children: [{ text: link.linkName }],
					// 	});
					// 	// Transforms.insertText(editor, textAfterLink);
					// });
				}
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
			case "code":
				return <CodeElement {...props} />;
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
					createCodeBlock={createCodeBlock}
					isCodeBlock={isCodeBlock()}
					createHeaderBlock={createHeaderBlock}
					isHeaderBlock={isHeaderBlock()}
				/>
				<Editable
					onKeyDown={handleSetEditorContent}
					renderLeaf={renderLeaf}
					renderElement={renderElement}
					className="min-h-[160px] w-full py-4 px-3"
				/>
			</div>
			<Button onClick={addCommentToTask} className="ml-auto m-5">
				Comment
			</Button>
		</Slate>
	);
};

export default TextEditor;

export { CodeElement, Leaf, TextEditorToolBar, HeaderElement };
export * from "./interfaces";
