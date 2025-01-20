import type { CreateNotificationRequest } from "@/gen/rpc/event";
import { commentService, eventService } from "@/lib/services";
import {
	useCommentStore,
	useModalStore,
	useTaskStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { cn } from "@/utils/cn";
import { handleFormatSlateToComment } from "@/utils/formatting";
import {
	clearCurrentLeafContent,
	getMentionFromLeaf,
	getMentionsFromSlate,
	injectMentionConfirm,
	isValidMentionBlock,
} from "@/utils/textEditorSelection";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
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
import TextEditorMentions from "./Menus/TextEditorMentions";
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
	const currentTask = useTaskStore((state) => state.currentTask);
	const users = useUserStore((state) => state.users);
	const currentUser = useUser().user;
	const currentWorkspace = useWorkspaceStore((state) => state.workspace);
	// Holding current content in editor
	const [editorContent, setEditorContent] = useState(initialValue);
	// Initialize Slate text editor
	const [editor] = useState(() => withReact(createEditor()));

	const [toggleMentions, setToggleMentions] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	// Mention search filter
	const [mentionsFilter, setMentionsFilter] = useState("");
	const [currentEnterUser, setCurrentEnterUser] = useState("");

	const debounceRef = useRef(false);
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
				const mentions = getMentionsFromSlate(editorContent);

				for (let i = 0; i < mentions.length; i++) {
					const currentMentionUser = mentions[i];

					const mentionedUser = users.find(
						(user) => user.name === currentMentionUser,
					);

					const mentionEvent: CreateNotificationRequest = {
						description: "Task Comment Mention",
						taskId: currentTask ?? currentTask.id,
						type: "MENTIONED",
						userId: mentionedUser.externalId ?? "",
						workspaceId: currentWorkspace.id ?? "",
					};

					await eventService.createNotification(TODO, mentionEvent);
				}

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

	const handleMentionKeyUp = (event: KeyboardEvent) => {
		if (event.key === "@") {
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
			case "mention":
				return "isMentionActive";
			case "mentionConfirm":
				return "isMentionConfirmActive";
			case "url":
				return "isLinkActive";
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
		isMentionActive: () => isMarkActive("mention"),
		isMentionConfirmActive: () => isMarkActive("mentionConfirm"),
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
					injectMentionConfirm(editor, currentEnterUser);
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
		const deleteEntireMention = () => {
			if (useEditorMarks().isMentionActive()) {
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
		isValidMentionBlock(editor) ? allowEntireMention() : deleteEntireMention();
		if (toggleMentions) {
			setMentionsFilter(getMentionFromLeaf(editor));
		}
	}, [editor.selection]);

	return (
		<Slate
			editor={editor}
			initialValue={initialValue}
			onChange={(newValue) => setEditorContent(newValue)}
		>
			<div className="markdown-content" onKeyUp={handleMentionKeyUp}>
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

			{toggleMentions && (
				<TextEditorMentions
					cursorPosition={position}
					mentionsFilter={mentionsFilter}
					editor={editor}
					setCurrentEnterUser={setCurrentEnterUser}
					setToggleMentions={setToggleMentions}
					debounceRef={debounceRef}
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
