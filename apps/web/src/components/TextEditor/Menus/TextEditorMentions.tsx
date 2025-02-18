import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
} from "@/components/ui/command";
import { useUserStore } from "@/store/users";
import { cn } from "@/utils/cn";
import { truncateString } from "@/utils/formatting";
import { injectMentionConfirm } from "@/utils/textEditorSelection";
import type { User } from "@squared/db";
import { CommandItem } from "cmdk";
import { CornerDownLeft } from "lucide-react";
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

	const usersRef = useRef<User[]>([]);

	// Helpers

	const currentCursorPosition = cursorPosition
		? cursorPosition
		: { x: 10, y: 10 };

	const handleMentionClick = (user: User) => {
		debounceRef.current = true;
		injectMentionConfirm(editor, user);
		setToggleMentions(false);
	};

	const handleUsersRef = (
		e: HTMLDivElement | null,
		index: number,
		user: User,
	) => {
		if (e) {
			usersRef.current[index] = user;
		}
	};

	// Effects

	useEffect(() => {
		if (usersRef.current.length > 0) {
			const firstVisibleUser = usersRef.current[0];
			if (firstVisibleUser) {
				setCurrentEnterUser(firstVisibleUser);
			}
		}
	}, [mentionsFilter]);

	return (
		<Command
			className="absolute h-auto w-64 rounded-lg border bg-background shadow-lg"
			style={{
				left: `${currentCursorPosition.x + 50}px`,
				top: `${currentCursorPosition.y - 50}px`,
			}}
		>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Users" className="h-60 overflow-y-scroll pt-0">
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
									className={cn(
										`${index === 0 && "bg-accent text-accent-foreground"} relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground`,
									)}
									ref={(e) => handleUsersRef(e, index, user)}
									onSelect={() => handleMentionClick(user)}
								>
									<label className="w-40 xl:text-sm">
										{truncateString(user.name, 13)}
									</label>
									{index === 0 && (
										<div className="flex w-32 select-none flex-row items-center justify-start ">
											<div className="ml-auto flex w-10 flex-row rounded-lg px-2 py-1 text-muted-foreground">
												<CornerDownLeft
													size={20}
													color="hsl(217,5%, 44%)"
													className="pr-1"
												/>
											</div>
										</div>
									)}
								</CommandItem>
							);
						})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export default TextEditorMentions;
