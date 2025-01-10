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
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import { formatUrl, getInitials } from "@/utils/formatting";
import type { Task, User } from "@squared/db";
import { ChevronDown, ChevronRight, UserSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BlockedByTasks = () => {
	const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(true);
	const { blockedByTasks } = useTaskStore((state) => state);
	const users = useUserStore((state) => state.users);

	return (
		<Collapsible
			open={isSubtasksExpanded}
			onOpenChange={setIsSubtasksExpanded}
			className="mt-6 bg-background rounded-lg p-4 shadow-sm"
		>
			<CollapsibleTrigger asChild>
				<div className="flex items-center cursor-pointer mb-2">
					{isSubtasksExpanded ? (
						<ChevronDown className="w-4 h-4 mr-2 transition-transform duration-200" />
					) : (
						<ChevronRight className="w-4 h-4 mr-2 transition-transform duration-200" />
					)}
					<h3 className="text-lg font-semibold">
						Blocked By ({blockedByTasks.length})
					</h3>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
				<ul className="space-y-2 my-4">
					{blockedByTasks.map((blockedByTask) => (
						<li
							key={blockedByTask.id}
							className={"transition-all duration-200 ease-in-out"}
						>
							<ContextMenu>
								<ContextMenuTrigger>
									<TaskContextMenu task={blockedByTask} />
									<SubtaskList
										task={blockedByTask}
										user={users.find((u) => u.id === blockedByTask.assigneeId)}
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
	const currentWorkspaceUrl = useWorkspaceStore(
		(state) => state.workspace,
	)?.url;
	return (
		<Link
			className="group/main grid grid-cols-24 items-center w-full py-2 bg-card border-t border-solid border-border hover:bg-accent"
			href={`/${currentWorkspaceUrl}/task/${task?.identifier}/${formatUrl(task.title)}`}
		>
			<div className="col-span-1 min-h-9" />
			<div className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0">
				<div className="col-span-10 text-foreground">
					<div className="flex justify-between w-full">
						<div className="flex items-center gap-2 text-base min-w-0">
							<PriorityIcon priority={task.priority} />
							<span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer flex-shrink-0 min-w-16">
								{task.identifier}
							</span>
							<Button
								variant="ghost"
								size="sm"
								className="mx-1 p-0 flex-shrink-0"
							>
								<StatusIcon status={task.status} />
							</Button>
							<span className="truncate min-w-0">{task.title}</span>
						</div>
						<div className="flex col-span-4 items-center lg:pr-5 justify-end gap-2">
							{user ? (
								<Avatar className="size-6 flex-shrink-0">
									<AvatarImage src={user.avatarUrl ?? undefined} />
									<AvatarFallback className="text-xxs">
										{getInitials(user.name ?? "")}
									</AvatarFallback>
								</Avatar>
							) : (
								<UserSearch className="size-6 text-[#9597AD] flex-shrink-0" />
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default BlockedByTasks;
