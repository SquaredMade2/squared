"use client";
import { MobileMenuSheetTrigger } from "@/components/MobileNav";
import { NewIssueCollapsible } from "@/components/Modals";
import {
	EventTabs,
	MobileTaskSettings,
	TaskBreadcrumbs,
	TaskDesignationsContainer,
	TaskPageForm,
	TaskSidebarTopRow,
} from "@/components/TaskPage";
import { LoadingTask } from "@/components/TaskPage/LoadingTask";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useTaskPage } from "@/hooks/useTaskPage";
import { useTaskStore } from "@/store";
import { cn } from "@/utils/cn";
import { formatUrl } from "@/utils/formatting";
import type { Status } from "@squared/db";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TaskPage = () => {
	const { tasks, updateTask } = useTaskStore((state) => state);
	const { task, isLoading, error, currentWorkspace } = useTaskPage();
	const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(true);
	const { toast } = useToast();

	const subtasks = tasks.filter((t) => t.parentId === task?.id);

	const handleSubtaskStatusChange = async (
		subtaskId: string,
		newStatus: string,
	) => {
		await updateTask(subtaskId, { status: newStatus as Status });
	};

	useEffect(() => {
		if (error) {
			toast({
				title: error,
				variant: "destructive",
			});
		}
	}, [error]);

	return (
		<div className="w-full h-screen flex bg-background overflow-hidden">
			{isLoading || !task ? (
				<LoadingTask />
			) : (
				<div className="w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden">
					<div className="w-full h-full p-2 md:p-5 xl:px-10 ">
						<div className="flex flex-col w-full relative">
							<div className="w-full snap-start z-0 overflow-x-hidden">
								<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
									<MobileMenuSheetTrigger />
									<TaskBreadcrumbs task={task} workspace={currentWorkspace} />
								</div>
							</div>
							<MobileTaskSettings />
							<div className="flex w-full relative">
								<ScrollArea className="h-[calc(100vh-5rem)] w-full">
									<div className="mr-1 max850:mr-1 md:mr-5 xl:mr-10">
										<TaskPageForm task={task} />
										{subtasks.length > 0 && (
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
													<ul className="space-y-2">
														{subtasks.map((subtask) => (
															<li
																key={subtask.id}
																className="opacity-0 translate-y-[-10px] transition-all duration-200 ease-in-out"
																style={{
																	opacity: isSubtasksExpanded ? 1 : 0,
																	transform: isSubtasksExpanded
																		? "translateY(0)"
																		: "translateY(-10px)",
																}}
															>
																<Button
																	variant="ghost"
																	className="w-full justify-start items-center"
																	type="button"
																>
																	<Checkbox
																		checked={subtask.status === "done"}
																		onCheckedChange={(checked) =>
																			handleSubtaskStatusChange(
																				subtask.id,
																				checked ? "done" : "todo",
																			)
																		}
																		className="mr-2"
																	/>
																	<Link
																		href={`/${currentWorkspace?.url}/task/${
																			subtask?.identifier
																		}/${formatUrl(subtask.title)}`}
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
															</li>
														))}
													</ul>
												</CollapsibleContent>
											</Collapsible>
										)}
										<NewIssueCollapsible parentId={task.id} />
										<EventTabs />
									</div>
								</ScrollArea>
								<div className="md:flex hidden flex-col gap-4">
									<TaskSidebarTopRow
										task={task}
										workspaceUrl={currentWorkspace?.url}
									/>
									<TaskDesignationsContainer />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskPage;
