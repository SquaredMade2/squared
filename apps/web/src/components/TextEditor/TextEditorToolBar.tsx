import { Bold, Heading, Italic } from "lucide-react";
import type { TextEditorToolBarProps } from "./TextEditor.interfaces";
import { Button } from "../ui/button";

const TextEditorToolBar = ({
	createBoldLeaf,
	createItalicLeaf,
	isBoldActive,
	isItalicActive,
	createCodeBlock,
	isCodeBlock,
	createHeaderBlock,
	isHeaderBlock,
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
				className={`w-8 h-8 ${isBoldActive ? "" : "text-gray-600"}`}
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
				className={`w-8 h-8 ${isItalicActive ? "" : "text-gray-600"}`}
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
				className={`w-8 h-8 ml-2 ${isCodeBlock ? "" : "text-gray-600"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createCodeBlock();
				}}
			>
				<span>&lt;/&gt;</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className={`w-8 h-8 ${isHeaderBlock ? "" : "text-gray-600"}`}
				onMouseDown={(e) => {
					e.preventDefault();
					createHeaderBlock();
				}}
			>
				<Heading className="w-4 h-4" />
				<span className="sr-only">Header</span>
			</Button>
		</div>
	);
};

export default TextEditorToolBar;
