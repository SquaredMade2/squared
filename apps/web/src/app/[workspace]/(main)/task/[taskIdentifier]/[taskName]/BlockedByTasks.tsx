"use client";
import { PriorityIcon, StatusIcon } from "@/components/Icons";
import TaskContextMenu from "@/components/ViewAllTasks/TaskCard/TaskContextMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useTaskStore, useUserStore } from "@/store";
import { formatUrl, getInitials } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import type { Task, User } from "@squared/db";
import { ChevronDown, ChevronRight, UserSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BlockedByTasks = () => {
	const [isBlockedByExpanded, setIsBlockedByExpanded] = useState(true);
	const { currentTaskBlockedBy } = useTaskStore((state) => state);
	const users = useUserStore((state) => state.users);

	return (
		<Collapsible
			open={isBlockedByExpanded}
			onOpenChange={setIsBlockedByExpanded}
			className="mt-6 rounded-lg bg-background p-4 shadow-sm"
		>
			<CollapsibleTrigger asChild>
				<div className="mb-2 flex cursor-pointer items-center">
					{isBlockedByExpanded ? (
						<ChevronDown className="mr-2 h-4 w-4 transition-transform duration-200" />
					) : (
						<ChevronRight className="mr-2 h-4 w-4 transition-transform duration-200" />
					)}
					<h3 className="font-semibold text-lg">
						Blocked By ({currentTaskBlockedBy.length})
					</h3>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
				<ul className="my-4 space-y-2">
					{currentTaskBlockedBy.map((task) => (
						<li
							key={task.id}
							className={"transition-all duration-200 ease-in-out"}
						>
							<ContextMenu>
								<ContextMenuTrigger>
									<TaskContextMenu task={task} />
									<SubtaskList
										task={task}
										user={users.find((u) => u.externalId === task.assigneeId)}
									/>
								</ContextMenuTrigger>
							</ContextMenu>
						</li>
					))}
				</ul>
			</CollapsibleContent>
		</Collapsible>
	);
};
interface SubtaskListProps {
	task: Task;
	user?: User;
}

const SubtaskList = ({ task, user }: SubtaskListProps) => {
	const { organization } = useOrganization();
	return (
		<Link
			className="group/main grid w-full grid-cols-24 items-center border-border border-t border-solid bg-card py-2 hover:bg-accent"
			href={`/${organization?.slug}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1 min-h-9" />
			<div className="col-span-23 grid grid-cols-10 pr-6 pl-2 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex w-full justify-between">
						<div className="flex min-w-0 items-center gap-2 text-base">
							<PriorityIcon priority={task.priority} />
							<span className="xs:hidden min-w-16 flex-shrink-0 cursor-pointer text-muted-foreground sm:hidden md:flex">
								{task.identifier}
							</span>
							<Button
								variant="ghost"
								size="sm"
								className="mx-1 flex-shrink-0 p-0"
							>
								<StatusIcon status={task.status} />
							</Button>
							<span className="min-w-0 truncate">{task.title}</span>
						</div>
						<div className="col-span-4 flex items-center justify-end gap-2 lg:pr-5">
							{user ? (
								<Avatar className="size-6 flex-shrink-0">
									<AvatarImage src={user.avatarUrl ?? undefined} />
									<AvatarFallback className="text-xxs">
										{getInitials(user.name ?? "")}
									</AvatarFallback>
								</Avatar>
							) : (
								<UserSearch className="size-6 flex-shrink-0 text-[#9597AD]" />
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default BlockedByTasks;
