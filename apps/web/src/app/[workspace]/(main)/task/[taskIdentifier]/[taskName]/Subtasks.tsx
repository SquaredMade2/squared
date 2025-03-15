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
import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import { formatUrl, getInitials } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import type { Task, User } from "@squared/db";
import { ChevronDown, ChevronRight, UserSearch } from "@squared/icons";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const Subtasks = () => {
	const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(true);
	const { setSubtasks, subtasks } = useTaskStore((state) => state);
	const users = useUserStore((state) => state.users);

	const { mutate: onDragEnd } = useMutation({
		mutationKey: ["task", "reorderSubtasks"],
		mutationFn: async (result: DropResult) => {
			if (!result.destination) return;

			const items = Array.from(subtasks);
			const [reorderedItem] = items.splice(result.source.index, 1);
			items.splice(result.destination.index, 0, reorderedItem);

			const updatedSubtasks = await client.task.updateSubtaskOrder
				.$post({
					parentId: subtasks[0].parentId ?? "",
					newOrder: items.map((item) => item.id),
				})
				.then((res) => res.json());

			setSubtasks(updatedSubtasks);

			return updatedSubtasks;
		},
	});

	return (
		<Collapsible
			open={isSubtasksExpanded}
			onOpenChange={setIsSubtasksExpanded}
			className="mt-6 rounded-lg bg-background p-4 shadow-xs"
		>
			<CollapsibleTrigger asChild>
				<div className="mb-2 flex cursor-pointer items-center">
					{isSubtasksExpanded ? (
						<ChevronDown className="mr-2 h-4 w-4 transition-transform duration-200" />
					) : (
						<ChevronRight className="mr-2 h-4 w-4 transition-transform duration-200" />
					)}
					<h3 className="font-semibold text-lg">
						Subtasks ({subtasks.length})
					</h3>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
				<DragDropContext onDragEnd={(result) => onDragEnd(result)}>
					<Droppable droppableId="subtasks">
						{(provided) => (
							<ul
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="my-4 space-y-2"
							>
								{subtasks
									.sort((a, b) => a.order - b.order)
									.map((subtask, index) => (
										<Draggable
											key={subtask.id}
											draggableId={subtask.id}
											index={index}
										>
											{(provided, snapshot) => (
												<li
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className={`transition-all duration-200 ease-in-out ${
														snapshot.isDragging ? "shadow-lg" : ""
													}`}
												>
													<ContextMenu>
														<ContextMenuTrigger>
															<TaskContextMenu task={subtask} />
															<SubtaskList
																task={subtask}
																user={users.find(
																	(u) => u.externalId === subtask.assigneeId,
																)}
															/>
														</ContextMenuTrigger>
													</ContextMenu>
												</li>
											)}
										</Draggable>
									))}
								{provided.placeholder}
							</ul>
						)}
					</Droppable>
				</DragDropContext>
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
							<span className="xs:hidden min-w-16 shrink-0 cursor-pointer text-muted-foreground sm:hidden md:flex">
								{task.identifier}
							</span>
							<Button variant="ghost" size="sm" className="mx-1 shrink-0 p-0">
								<StatusIcon status={task.status} />
							</Button>
							<span className="min-w-0 truncate">{task.title}</span>
						</div>
						<div className="col-span-4 flex items-center justify-end gap-2 lg:pr-5">
							{user ? (
								<Avatar className="size-6 shrink-0">
									<AvatarImage src={user.avatarUrl ?? undefined} />
									<AvatarFallback className="text-xxs">
										{getInitials(user.name ?? "")}
									</AvatarFallback>
								</Avatar>
							) : (
								<UserSearch className="size-6 shrink-0 text-[#9597AD]" />
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Subtasks;
