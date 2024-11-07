import { PriorityIcon } from "@/components/Icons";
import TaskContextMenu from "@/components/ViewAllTasks/TaskCard/TaskContextMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { cn } from "@/utils/cn";
import { formatUrl } from "@/utils/formatting";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { TODO } from "@squared/context";
import type { Task, User } from "@squared/db";
import { ChevronDown, ChevronRight, UserSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Subtasks = ({
	subtasks,
	currentWorkspaceUrl,
	users,
}: {
	subtasks: Task[];
	currentWorkspaceUrl?: string;
	users: User[];
}) => {
	const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(true);
	const { tasks } = useTaskStore((state) => state);

	const onDragEnd = async (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(subtasks);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		const updatedTasks = await taskService.reorderSubtasks(TODO, {
			parentId: subtasks[0].parentId ?? "",
			newOrder: items.map((item) => item.id),
		});

		return tasks.map((task) => {
			const updatedTask = updatedTasks.find((ut) => ut.id === task.id);
			return updatedTask ? updatedTask : task;
		});
	};
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
						Subtasks ({subtasks.length})
					</h3>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="subtasks">
						{(provided) => (
							<ul
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="space-y-2 my-4"
							>
								{subtasks.map((subtask, index) => (
									<Draggable
										draggableId={subtask.id}
										index={index}
										key={subtask.id}
									>
										{(provided) => (
											<li
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="opacity-0 translate-y-[-10px] transition-all duration-200 ease-in-out"
												style={{
													opacity: isSubtasksExpanded ? 1 : 0,
													transform: isSubtasksExpanded
														? "translateY(0)"
														: "translateY(-10px)",
													...provided.draggableProps.style,
												}}
											>
												<ContextMenu>
													<ContextMenuTrigger>
														<TaskContextMenu task={subtask} />
														<Button
															variant="ghost"
															className="w-full justify-start gap-2"
															type="button"
														>
															<span className="text-muted-foreground">
																{subtask.identifier}
															</span>
															<PriorityIcon priority={subtask.priority} />
															{subtask.assigneeId ? (
																<Avatar className="w-6 h-6 ml-2">
																	<AvatarImage
																		src={
																			users.find(
																				(u) => u.id === subtask.assigneeId,
																			)?.avatarUrl ?? undefined
																		}
																		alt={subtask.assigneeName ?? undefined}
																	/>
																	<AvatarFallback>
																		{subtask.assigneeName
																			?.split(" ")
																			.map((n) => n[0])
																			.join("")}
																	</AvatarFallback>
																</Avatar>
															) : (
																<UserSearch className="size-6" />
															)}
															<Link
																href={`/${currentWorkspaceUrl}/task/${
																	subtask?.identifier
																}/${formatUrl(subtask.title)}`}
																className="flex-grow text-left ml-2"
															>
																<span
																	className={cn(
																		subtask.status === "done"
																			? "line-through text-muted-foreground"
																			: "",
																		"cursor-pointer",
																	)}
																>
																	{subtask.title}
																</span>
															</Link>
														</Button>
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

export default Subtasks;
