import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
} from "@/components/ui/command";
import { useUserStore } from "@/store/users";
import { injectMentionConfirm } from "@/utils/textEditorSelection";
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
		debounceRef.current = true;
		injectMentionConfirm(editor, user);
		setToggleMentions(false);
	};

	const handleUsersRef = (e: HTMLDivElement | null, index: number) => {
		if (e) {
			usersRef.current[index] = e;
		}
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
	}, [mentionsFilter]);

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
				<CommandGroup heading="Users">
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
									ref={(e) => handleUsersRef(e, index)}
								>
									<button
										className={`${index === 0 && "bg-primary p-1 rounded-lg"}`}
										type="submit"
										onClick={() => handleMentionClick(user.name)}
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
