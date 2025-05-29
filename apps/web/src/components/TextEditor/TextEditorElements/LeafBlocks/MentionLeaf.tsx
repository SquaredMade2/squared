import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getInitials, truncateString } from "@/utils/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Card, CardContent } from "@squaredmade/ui/card";
import type { RenderLeafProps } from "slate-react";
const MentionLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
	return (
		<HoverCard>
			<HoverCardTrigger
				{...attributes}
				style={{ marginBottom: 0 }}
				className="inline-flex items-center rounded bg-muted-foreground"
			>
				{children}
			</HoverCardTrigger>
			<HoverCardContent className="absolute bottom-8 min-h-20">
				<Card className="flex min-h-20 flex-row items-center justify-center px-1 py-0">
					<CardContent className="flex flex-row items-center px-1 py-0">
						<Avatar className="mx-2 flex size-6 shrink-0 items-center">
							<AvatarImage
								src={leaf.mentionConfirm?.imageUrl || undefined}
								alt={`${leaf.mentionConfirm?.firstName} ${leaf.mentionConfirm?.lastName}`}
							/>
							<AvatarFallback className="text-xxs">
								{getInitials(
									`${leaf.mentionConfirm?.firstName} ${leaf.mentionConfirm?.lastName}`,
								)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col whitespace-nowrap">
							<header>
								{truncateString(
									`${leaf.mentionConfirm?.firstName} ${leaf.mentionConfirm?.lastName}`,
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

export default MentionLeaf;
