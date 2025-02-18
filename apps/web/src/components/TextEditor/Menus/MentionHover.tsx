import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store";
import { getInitials, truncateString } from "@/utils/formatting";
import type { User } from "@squared/db";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@squaredmade/ui/hover-card";
import { useEffect, useState } from "react";
import type { MentionHoverProps } from "../interfaces";

const MentionHover = ({ mentionedUser }: MentionHoverProps) => {
	const users = useUserStore((state) => state.users);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const foundUser = users.find((user) => user.id === mentionedUser.id);
		if (foundUser) {
			setCurrentUser(foundUser);
		}
	}, [mentionedUser]);
	return (
		<HoverCard>
			<HoverCardTrigger className="rounded bg-muted-foreground">
				<p style={{ marginBottom: 0 }}>{mentionedUser.name}</p>
			</HoverCardTrigger>
			<HoverCardContent className="absolute bottom-8 min-h-20">
				<Card className="flex min-h-20 flex-row items-center justify-center px-1 py-0">
					<CardContent className="flex flex-row items-center px-1 py-0">
						<Avatar className="mx-2 flex size-6 flex-shrink-0 items-center">
							<AvatarImage src={currentUser?.avatarUrl || undefined} />
							<AvatarFallback className="text-xxs">
								{getInitials(currentUser?.name || "User")}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col whitespace-nowrap">
							<header>
								{truncateString(currentUser?.name || "Unknown name.", 25)}
							</header>
							<header className="text-muted-foreground">
								{truncateString(
									currentUser?.email || "No email available.",
									25,
								)}
							</header>
						</div>
					</CardContent>
				</Card>
			</HoverCardContent>
		</HoverCard>
	);
};

export default MentionHover;
