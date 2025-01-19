import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
	// CommandSeparator,
} from "@/components/ui/command";
import { useUserStore } from "@/store/users";
import {
	injectMentionConfirm,
	replaceTextOfCurrentNode,
} from "@/utils/textEditorSelection";
import { CommandItem } from "cmdk";
import { useEffect, useRef } from "react";
import type { TextEditorMentionsProps } from "../interfaces";

const TextEditorMentions = ({
	cursorPosition,
	mentionsFilter,
	editor,
	setCurrentEnterUser,
	setToggleMentions,
	debounceRef,
}: TextEditorMentionsProps) => {
	// State
	const users = useUserStore((state) => state.users);

	const usersRef = useRef<HTMLDivElement[]>([]);

	// Helpers

	const currentCursorPosition = cursorPosition
		? cursorPosition
		: { x: 10, y: 10 };

	const handleMentionClick = (user: string) => {
		injectMentionConfirm(editor, user);
	};

	// Effects

	useEffect(() => {
		if (usersRef.current.length > 0) {
			const firstVisibleUser = usersRef.current.find((user) => user !== null);
			if (firstVisibleUser) {
				const firstName = firstVisibleUser.textContent
					? firstVisibleUser.textContent?.trim()
					: "";
				setCurrentEnterUser(firstName);
			}
		}
	});

	return (
		<Command
			className="absolute border bg-background rounded-lg shadow-lg w-64 h-auto"
			style={{
				left: `${currentCursorPosition.x + 50}px`,
				top: `${currentCursorPosition.y - 50}px`,
			}}
		>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Formatting">
					{users
						.filter((user) =>
							user.name
								.toLowerCase()
								.includes(mentionsFilter.slice(1).toLowerCase()),
						)
						.map((user, index) => {
							return (
								<CommandItem
									key={user.id}
									className="m-2"
									ref={(e) => {
										if (!usersRef.current) return;
										usersRef.current[index] = e;
									}}
								>
									<button
										type="submit"
										onClick={() => {
											debounceRef.current = true;
											handleMentionClick(user.name);
											setToggleMentions(false);
										}}
									>
										{user.name}
									</button>
								</CommandItem>
							);
						})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export default TextEditorMentions;
