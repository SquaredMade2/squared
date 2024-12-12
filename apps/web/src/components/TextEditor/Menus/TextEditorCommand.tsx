import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
	// CommandSeparator,
} from "@/components/ui/command";
import { clearCurrentLeafContent } from "@/utils/textEditorSelection";
import { CommandItem } from "cmdk";
import type { TextEditorCommandProps } from "../interfaces";

const TextEditorCommand = ({
	cursorPosition,
	commandFilter,
	editor,
	executeCommand,
	setToggleCommand,
}: TextEditorCommandProps) => {
	const currentCursorPosition = cursorPosition
		? cursorPosition
		: { x: 10, y: 10 };

	// Helpers

	const commands = ["Bold", "Italic", "Code", "Header"];

	const handleCommandClick = (command: string) => {
		clearCurrentLeafContent(editor);
		executeCommand(command);
		setToggleCommand(false);
	};

	return (
		<Command
			value={commandFilter.slice(1)}
			className="absolute border bg-background rounded-lg shadow-lg w-64 h-auto"
			style={{
				left: `${currentCursorPosition.x + 50}px`,
				top: `${currentCursorPosition.y - 50}px`,
			}}
		>
			<CommandInput
				placeholder="Type in a Command."
				className="hidden"
				value={commandFilter.slice(1)}
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Formatting">
					{commands.map((command) => {
						// just command here is a unique key
						return (
							<CommandItem key={command} className="m-2">
								<button
									type="submit"
									onClick={() => handleCommandClick(command)}
								>
									{command}
								</button>
							</CommandItem>
						);
					})}
				</CommandGroup>
				{/* TODO: When implementing tables, add new command for it here */}
				{/* <CommandSeparator /> */}
				{/* <CommandGroup heading="Create">
					<CommandItem>Table</CommandItem>
				</CommandGroup> */}
			</CommandList>
		</Command>
	);
};

export default TextEditorCommand;
