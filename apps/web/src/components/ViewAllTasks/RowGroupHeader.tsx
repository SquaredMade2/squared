import { PriorityIcon, StatusIcon } from "@/components/Icons";
import { useUsers } from "@/hooks/useUsers";
import { useWorkspaceStore } from "@/store";
import {
	formatName,
	formatPriority,
	formatStatus,
	getInitials,
} from "@/utils/formatting";
import type { Priority, Status } from "@squared/db";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { UserSearch } from "lucide-react";

// Moved from GroupColumn/index.tsx to make it reusable
export const RowGroupHeader = ({
	group,
	groupType,
	count,
}: {
	group: string;
	groupType: string;
	count: number;
}) => {
	const { users } = useUsers();
	const workspace = useWorkspaceStore((state) => state.workspace);

	switch (groupType) {
		case "Status":
			return (
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center">
						<StatusIcon status={group as Status} />
						<span className="ml-2 font-medium text-sm">
							{formatStatus(group as Status)}
						</span>
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		case "Priority":
			return (
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center">
						<PriorityIcon priority={group as Priority} />
						<span className="ml-2 font-medium text-sm">
							{formatPriority(group as Priority)}
						</span>
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		case "Assignee": {
			const user = users?.find((u) => u.userId === group);
			return (
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center">
						{user ? (
							<>
								<Avatar className="size-5 text-xxs">
									<AvatarImage src={user.imageUrl ?? ""} />
									<AvatarFallback>
										{getInitials(formatName(user))}
									</AvatarFallback>
								</Avatar>
								<span className="ml-2 font-medium text-sm">
									{formatName(user)}
								</span>
							</>
						) : (
							<>
								<UserSearch className="size-4 text-muted-foreground" />
								<span className="ml-2 font-medium text-sm">Unassigned</span>
							</>
						)}
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		}
		case "Label": {
			const label = workspace?.labels.find((l) => l.name === group);
			return (
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center">
						{label && (
							<div
								className="mr-2 h-3 w-3 rounded-full"
								style={{ backgroundColor: label.color }}
							/>
						)}
						<span className="font-medium text-sm">{group}</span>
					</div>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
		}
		default:
			return (
				<div className="flex w-full items-center justify-between">
					<span className="font-medium text-sm">{group}</span>
					<span className="text-muted-foreground text-xs">{count}</span>
				</div>
			);
	}
};
