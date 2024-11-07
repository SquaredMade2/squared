import { Bold, Heading, Italic } from "lucide-react";
import { Button } from "../ui/button";
import LinkModal from "./LinkModal";
import type { TextEditorToolBarProps } from "./interfaces";

const TextEditorToolBar = ({
	createBoldLeaf,
	createItalicLeaf,
	createCodeLeaf,
	isBoldActive,
	isItalicActive,
	isCodeActive,
	createHeaderBlock,
	isHeaderBlock,

	injectLinkContent,
	selection,
	// Todos:
	// Quote
	// Link
	// Numbered list
	// Unordered List

	// Checkboxes
	// attach files
	// mention
	// reference
	// slash commands
	// Separator
}: TextEditorToolBarProps) => {
	return (
		<div className="flex flex-row items-center shadow-md rounded-m p-2 p-10 h-16 border">
			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${isBoldActive ? "" : "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createBoldLeaf();
				}}
			>
				<Bold className="w-4 h-4" />
				<span className="sr-only">Bold</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${isItalicActive ? "" : "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createItalicLeaf();
				}}
			>
				<Italic className="w-4 h-4" />
				<span className="sr-only">Italic</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ml-2 ${isCodeActive ? "" : "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createCodeLeaf();
				}}
			>
				<span>{"</>"}</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${isHeaderBlock ? "" : "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createHeaderBlock();
				}}
			>
				<Heading className="size-4" />
				<span className="sr-only">Header</span>
			</Button>
			<LinkModal injectLinkContent={injectLinkContent} selection={selection} />
		</div>
	);
};

export default TextEditorToolBar;
