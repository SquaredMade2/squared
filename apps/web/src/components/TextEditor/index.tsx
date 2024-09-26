import { useState } from "react";
import type { BaseEditor } from "slate";
import { createEditor } from "slate";
import type { ReactEditor } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";
import type {
	CustomElement,
	CustomText,
	// TextEditorProps,
} from "./TextEditor.interfaces";

declare module "slate" {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

const initialValue: CustomElement[] = [
	{
		type: "paragraph",
		children: [{ text: "A line of text in a paragraph." }],
	},
];

const TextEditor = () => {
	// Initialize Slate text editor
	const [editor] = useState(() => withReact(createEditor()));
	console.log(editor);
	return (
		<Slate editor={editor} initialValue={initialValue}>
			<Editable />
		</Slate>
	);
};

export default TextEditor;
