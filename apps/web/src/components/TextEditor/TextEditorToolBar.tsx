import { Button } from "@squaredmade/ui/button";
import { Bold, Heading, Italic } from "lucide-react";
import LinkModal from "./LinkModal";
import type { TextEditorToolBarProps } from "./interfaces";

const TextEditorToolBar = ({
	createLeaf,
	markActiveChecks,
	injectLinkContent,
	createHeaderBlock,
	isHeaderBlock,

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
				className={`size-8 ${!markActiveChecks.isBoldActive() && "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createLeaf("bold");
				}}
			>
				<Bold className="w-4 h-4" />
				<span className="sr-only">Bold</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${!markActiveChecks.isItalicActive() && "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createLeaf("italic");
				}}
			>
				<Italic className="w-4 h-4" />
				<span className="sr-only">Italic</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ml-2 ${!markActiveChecks.isCodeActive() && "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createLeaf("code");
				}}
			>
				<span>{"</>"}</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${!isHeaderBlock && "text-muted-foreground"}`}
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
