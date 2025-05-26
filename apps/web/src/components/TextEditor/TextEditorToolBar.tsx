import { Bold, Heading, Italic } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
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
		<div className="flex h-16 flex-row items-center rounded-m border px-2 py-4 shadow-md">
			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${!markActiveChecks.isBoldActive() && "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createLeaf("bold");
				}}
			>
				<Bold className="h-4 w-4" />
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
				<Italic className="h-4 w-4" />
				<span className="sr-only">Italic</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`size-8 ${!markActiveChecks.isUnderlineActive() && "text-muted-foreground"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createLeaf("underline");
				}}
			>
				<Underline className="h-4 w-4" />
				<span className="sr-only">Underline</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`ml-2 size-8 ${!markActiveChecks.isCodeActive() && "text-muted-foreground"}`}
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
