import { Card, CardContent } from "@/components/ui/card";
import { getInitials, truncateString } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import type { PublicUserData } from "@clerk/types";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@squaredmade/ui/hover-card";
import { useEffect, useState } from "react";
import type { MentionHoverProps } from "../interfaces";

const MentionHover = ({ mentionedUser }: MentionHoverProps) => {
	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});

	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);
	const [currentUser, setCurrentUser] = useState<PublicUserData | null>(null);

	useEffect(() => {
		const handleCurrentUser = () => {
			if (!users) return;
			const foundUser = users.find(
				(user) => user.userId === mentionedUser.userId,
			);
			if (!foundUser) return;
			setCurrentUser(foundUser);
		};
		handleCurrentUser();
	}, [mentionedUser]);
	return (
		<HoverCard>
			<HoverCardTrigger className="rounded bg-muted-foreground">
				<p style={{ marginBottom: 0 }}>
					{mentionedUser.firstName || "Unknown name."}
				</p>
			</HoverCardTrigger>
			<HoverCardContent className="absolute bottom-8 min-h-20">
				<Card className="flex min-h-20 flex-row items-center justify-center px-1 py-0">
					<CardContent className="flex flex-row items-center px-1 py-0">
						<Avatar className="mx-2 flex size-6 flex-shrink-0 items-center">
							<AvatarImage src={currentUser?.imageUrl || undefined} />
							<AvatarFallback className="text-xxs">
								{getInitials(currentUser?.firstName || "User")}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col whitespace-nowrap">
							<header>
								{truncateString(currentUser?.firstName || "Unknown name.", 25)}
							</header>
						</div>
					</CardContent>
				</Card>
			</HoverCardContent>
		</HoverCard>
	);
};

export default MentionHover;
