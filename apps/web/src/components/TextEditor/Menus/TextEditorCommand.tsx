import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { CommandItem } from "cmdk";
import type { TextEditorCommandProps } from "../interfaces";

const TextEditorCommand = ({ cursorPosition }: TextEditorCommandProps) => {
	const currentCursorPosition = cursorPosition
		? cursorPosition
		: { x: 10, y: 10 };

	return (
		<Command
			// w-40 h-66
			className="border w-10 h-10"
			style={{
				position: "absolute",
				left: currentCursorPosition.x,
				top: currentCursorPosition.y,
			}}
		>
			<CommandInput placeholder="Type in a Command." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Formatting">
					<CommandItem>Bold</CommandItem>
					<CommandItem>Italic</CommandItem>
					<CommandItem>Code</CommandItem>
					<CommandItem>Header</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Create">
					<CommandItem>Table</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export default TextEditorCommand;
