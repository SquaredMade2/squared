import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";
import { formatName, getInitials, truncateString } from "@/utils/formatting";
import { injectMentionConfirm } from "@/utils/textEditorSelection";
import { useOrganization } from "@clerk/nextjs";
import type { PublicUserData } from "@clerk/types";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
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

	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});

	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);

	const usersRef = useRef<PublicUserData[]>([]);

	// Helpers

	const currentCursorPosition = cursorPosition
		? cursorPosition
		: { x: 10, y: 10 };

	const handleMentionClick = (user: PublicUserData) => {
		debounceRef.current = true;
		injectMentionConfirm(editor, user);
		setToggleMentions(false);
	};

	const handleUsersRef = (
		e: HTMLDivElement | null,
		index: number,
		user: PublicUserData,
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
						?.filter((user) =>
							user.firstName
								?.toLowerCase()
								.includes(mentionsFilter.slice(1).toLowerCase()),
						)
						.map((user, index) => {
							return (
								<CommandItem
									key={user.userId}
									className={cn(
										`${index === 0 && "bg-accent text-accent-foreground"} relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground`,
									)}
									ref={(e) => handleUsersRef(e, index, user)}
									onSelect={() => handleMentionClick(user)}
								>
									<Avatar className="mx-2 flex size-6 flex-shrink-0 items-center">
										<AvatarImage src={user.imageUrl} className="rounded " />
										<AvatarFallback className="rounded text-xxs">
											{getInitials(formatName(user))}
										</AvatarFallback>
									</Avatar>
									<span className="w-40 xl:text-sm">
										{truncateString(user.firstName || "Unknown Name", 13)}
									</span>
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
