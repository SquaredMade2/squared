"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workspaceService } from "@/lib/services";
import { useUserStore, useWorkspaceStore } from "@/store";
import { type TaskOrder, TaskOrderOptions, useViewStore } from "@/store/views";
import {
	compareNullableDates,
	compareNullableNumbers,
	compareNullableStrings,
} from "@/utils/compareSorting";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import type { Sprint, Task } from "@squared/db";
import { Priority, Status } from "@squared/db";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PriorityIcon, StatusIcon } from "../Icons";
import LabelBadge from "../LabelBadges";

import { toast } from "../ui/use-toast";

interface AssignTasksDialogProps {
	activeSprint: Sprint | null;
	upcomingSprints: Sprint[];
	unassignedTasks: Task[];
	selectedTasks: Task[];
	setSelectedTasks: (tasks: Task[]) => void;
	handleBulkAssign: () => void;
	setTargetSprint?: (sprintId: string) => void;
}

const priorityOrder = [
	Priority.noPriority,
	Priority.low,
	Priority.medium,
	Priority.high,
	Priority.urgent,
];

const statusOrder = [
	Status.backlog,
	Status.todo,
	Status.inProgress,
	Status.inReview,
	Status.done,
	Status.canceled,
	Status.archived,
];

export function AssignTasksDialog({
	activeSprint,
	upcomingSprints,
	unassignedTasks,
	selectedTasks,
	setSelectedTasks,
	handleBulkAssign,
	setTargetSprint,
}: AssignTasksDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"list" | "grid">("list");
	const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
	const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
	const [filterLabel, setFilterLabel] = useState<string>("all");
	const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(
		activeSprint?.id,
	);
	const users = useUserStore((state) => state.users);

	const { view, setGridViewOptions, setListViewOptions, displayOptions } =
		useViewStore((state) => state);
	const { orderBy, orderAscending } = displayOptions.taskOrder;
	const { taskOrder, groupTasksBy } = displayOptions;
	const orderByOptions = TaskOrderOptions;

	const params = useParams();
	const workspaceUrl = parseParams(params.workspace);
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);

	const setOptions = view === "grid" ? setGridViewOptions : setListViewOptions;

	useEffect(() => {
		if (activeSprint) {
			setSelectedSprintId(activeSprint.id);
		} else if (upcomingSprints.length > 0) {
			setSelectedSprintId(upcomingSprints[0].id);
		}
	}, [activeSprint, upcomingSprints]);

	const handleTaskSelection = (task: Task) => {
		setSelectedTasks(
			selectedTasks.includes(task)
				? selectedTasks.filter((t) => t.id !== task.id)
				: [...selectedTasks, task],
		);
	};

	const handleSelectAll = (checked: boolean) => {
		setSelectedTasks(checked ? filteredTasks : []);
	};

	const mapPriority = (priority: Priority) => {
		switch (priority) {
			case "noPriority":
				return 0;
			case "low":
				return 1;
			case "medium":
				return 2;
			case "high":
				return 3;
			case "urgent":
				return 4;
			default:
				return 0;
		}
	};

	const mapStatus = (status: Status) => {
		switch (status) {
			case "backlog":
				return 1;
			case "inProgress":
				return 2;
			case "inReview":
				return 3;
			case "done":
				return 4;
			default:
				return 0;
		}
	};

	const filteredTasks = useMemo(() => {
		return unassignedTasks
			.filter((t) => !["done", "canceled", "archived"].includes(t.status))
			.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
			.filter((t) => filterPriority === "all" || t.priority === filterPriority)
			.filter((t) => filterStatus === "all" || t.status === filterStatus)
			.filter(
				(t) =>
					filterLabel === "all" ||
					t.labels.map((l) => l.name).includes(filterLabel),
			)
			.sort((a, b) => {
				const priorityDiff = mapPriority(b.priority) - mapPriority(a.priority);
				if (priorityDiff !== 0) return priorityDiff;
				const statusDiff = mapStatus(b.status) - mapStatus(a.status);
				if (statusDiff !== 0) return statusDiff;
				return a.dueDate && b.dueDate
					? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
					: 0;
			});
	}, [unassignedTasks, searchQuery, filterPriority, filterStatus, filterLabel]);

	const orderTasks = (tasks: Task[]): Task[] => {
		return tasks.sort((a, b) => {
			let comparison = 0;

			switch (orderBy) {
				case "Title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "Status":
					comparison =
						statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
					break;
				case "Priority":
					comparison =
						priorityOrder.indexOf(a.priority) -
						priorityOrder.indexOf(b.priority);
					break;
				case "Assignee": {
					const aAssignee =
						users.find((u) => u.id === a.assigneeId)?.name ?? null;
					const bAssignee =
						users.find((u) => u.id === b.assigneeId)?.name ?? null;
					comparison = compareNullableStrings(aAssignee, bAssignee);
					break;
				}
				case "Effort":
					comparison = compareNullableNumbers(
						a.effortEstimate,
						b.effortEstimate,
					);
					break;
				case "Due Date":
					comparison = compareNullableDates(a.dueDate, b.dueDate);
					break;
				case "Updated":
					comparison =
						new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
					break;
				case "Created":
					comparison =
						new Date(a.dateCreated).getTime() -
						new Date(b.dateCreated).getTime();
					break;
				default:
					break;
			}

			return orderAscending ? comparison : -comparison;
		});
	};

	const tooltipContent = (): string => {
		return ["Title", "Status", "Assignee"].includes(taskOrder.orderBy)
			? taskOrder.orderAscending
				? "A-Z"
				: "Z-A"
			: ["Priority", "Effort"].includes(taskOrder.orderBy)
				? taskOrder.orderAscending
					? "Ascending"
					: "Descending"
				: ["Due Date", "Updated", "Created"].includes(taskOrder.orderBy)
					? taskOrder.orderAscending
						? "Oldest first"
						: "Newest first"
					: "";
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Assign Tasks</Button>
			</DialogTrigger>
			<DialogContent className="flex h-[90vh] flex-col p-0">
				<DialogHeader className="p-6 pb-2">
					<DialogTitle>Assign Tasks to Sprint</DialogTitle>
					<DialogDescription>
						Select tasks and assign them to a sprint.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 px-6 flex-grow overflow-hidden">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
						<div className="flex items-center gap-2 w-full mt-2">
					
							<Select
								onValueChange={setTargetSprint}
								defaultValue={selectedSprintId}
							>
								<SelectTrigger className="w-full sm:w-72" id="sprint">
									<SelectValue placeholder="Select a sprint" />
								</SelectTrigger>
								<SelectContent className="w-full sm:w-72">
									{[activeSprint, ...upcomingSprints].map(
										(sprint) =>
											sprint && (
												<SelectItem key={sprint.id} value={sprint.id}>
													{sprint?.name}
												</SelectItem>
											),
									)}
								</SelectContent>
							</Select>
							<Input
								placeholder="Search tasks..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-grow"
							/>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
						<div className="flex items-center gap-2 w-full sm:w-auto">
							<Select
								value={filterPriority}
								onValueChange={(value) => setFilterPriority(value as Priority)}
							>
								<SelectTrigger className="w-full sm:w-[150px]">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Priorities</SelectItem>
									<SelectItem value="noPriority">No Priority</SelectItem>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={filterStatus}
								onValueChange={(value) => setFilterStatus(value as Status)}
							>
								<SelectTrigger className="w-full sm:w-[150px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="backlog">Backlog</SelectItem>
									<SelectItem value="todo">To Do</SelectItem>
									<SelectItem value="inProgress">In Progress</SelectItem>
									<SelectItem value="inReview">In Review</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={filterLabel}
								onValueChange={(value) => setFilterLabel(value)}
							>
								<SelectTrigger className="w-full sm:w-[150px]">
									<SelectValue placeholder="Labels" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Labels</SelectItem>
									{workspace?.labels.map((label) => (
										<SelectItem key={label.name} value={label.name}>
											{label.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<div className="w-full sm:w-[150px] flex gap-2">
								<div className="border-l-2 border-border h-10" />

								<Select
									onValueChange={(value) =>
										setOptions({
											taskOrder: { ...taskOrder, orderBy: value as TaskOrder },
										})
									}
									value={taskOrder.orderBy}
								>
									<TooltipProvider delayDuration={0}>
										<Tooltip>
											<TooltipTrigger asChild>
												<SelectTrigger>
													<SelectValue className="justify-between">
														<span>{taskOrder.orderBy}</span>
													</SelectValue>
												</SelectTrigger>
											</TooltipTrigger>
											<TooltipContent>{"Order by"}</TooltipContent>
										</Tooltip>
									</TooltipProvider>

									<SelectContent>
										{orderByOptions
											.filter((option) => option !== groupTasksBy)
											.map((option) => (
												<SelectItem key={option} value={option}>
													{option}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setOptions({
													taskOrder: {
														...taskOrder,
														orderAscending: !taskOrder.orderAscending,
													},
												})
											}
										>
											{taskOrder.orderAscending ? (
												<ArrowUpWideNarrow className="size-4" />
											) : (
												<ArrowDownWideNarrow className="size-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>{tooltipContent()}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
					<Tabs
						value={viewMode}
						onValueChange={(value) => setViewMode(value as "list" | "grid")}
						className="flex flex-grow flex-col overflow-hidden"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="list">List View</TabsTrigger>
							<TabsTrigger value="grid">Grid View</TabsTrigger>
						</TabsList>
						<TabsContent
							value="list"
							className="mt-0 flex-grow overflow-hidden"
						>
							<ScrollArea className="h-full w-full rounded-md border">
								<div className="p-4">
									<div className="group flex w-full items-center rounded border-border border-b px-4 py-2 hover:bg-accent">
										<Checkbox
											id="select-all"
											checked={selectedTasks.length === filteredTasks.length}
											onCheckedChange={handleSelectAll}
										/>
										<Label htmlFor="select-all" className="ml-3 font-semibold">
											Select All
										</Label>
									</div>

									{orderTasks(filteredTasks).map((task: Task) => {
										const taskLabels = workspace?.labels.filter((label) =>
											task.labels.includes(label),
										);
										return (
											<div
												key={task.id}
												className="group flex w-full items-center justify-between rounded border-border border-b px-4 py-2 hover:bg-accent"
											>
												<div className="flex min-w-0 shrink items-center gap-2">
													<Checkbox
														id={task.id}
														checked={selectedTasks.includes(task)}
														onCheckedChange={() => handleTaskSelection(task)}
														className="mr-2 flex-shrink-0"
													/>
													<PriorityIcon priority={task.priority} />
													<StatusIcon status={task.status} />
													<span className="max-w-64 truncate font-medium text-sm">
														{task.title}
													</span>
												</div>
												<div className="ml-2 flex flex-shrink-0 items-center justify-end gap-2">
													<div className="flex flex-row">
														{taskLabels?.map((label) => (
															<div key={label.name} className="mx-0.5">
																<LabelBadge label={label} />
															</div>
														))}
													</div>
													{task.dueDate && (
														<span className="whitespace-nowrap text-muted-foreground text-xs">
															{new Date(task.dueDate).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																},
															)}
														</span>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</ScrollArea>
						</TabsContent>
						<TabsContent
							value="grid"
							className="mt-0 flex-grow overflow-hidden"
						>
							<ScrollArea className="h-full w-full rounded-md border">
								<div className="p-4">
									<div className="mb-2 flex items-center">
										<Checkbox
											id="select-all-grid"
											checked={selectedTasks.length === filteredTasks.length}
											onCheckedChange={handleSelectAll}
										/>
										<Label htmlFor="select-all-grid" className="ml-2">
											Select All
										</Label>
									</div>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
										{filteredTasks.map((task) => {
											const taskLabels = workspace?.labels.filter((label) =>
												task.labels.includes(label),
											);
											return (
												<div
													key={task.id}
													className="group flex flex-col rounded-lg border p-4 hover:bg-accent"
												>
													<div className="mb-2 flex items-center justify-between">
														<Checkbox
															id={task.id}
															checked={selectedTasks.includes(task)}
															onCheckedChange={() => handleTaskSelection(task)}
														/>
														<div className="flex items-center gap-2">
															<PriorityIcon priority={task.priority} />
															<StatusIcon status={task.status} />
														</div>
													</div>
													<span className="mb-2 line-clamp-2 font-medium text-sm">
														{task.title}
													</span>
													<div className="mb-1 flex flex-wrap">
														{taskLabels?.map((label) => (
															<span
																key={label.name}
																className="mb-1 flex-shrink"
															>
																<LabelBadge label={label} />
															</span>
														))}
													</div>
													{task.dueDate && (
														<span className="text-muted-foreground text-xs">
															Due:{" "}
															{new Date(task.dueDate).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																},
															)}
														</span>
													)}
												</div>
											);
										})}
									</div>
								</div>
							</ScrollArea>
						</TabsContent>
					</Tabs>
				</div>
				<DialogFooter className="p-6 pt-2">
					<Button
						onClick={() => {
							handleBulkAssign();
							setIsOpen(false);
							toast({
								title: `You successfully added ${selectedTasks.length} ${
									selectedTasks.length < 2 ? "task" : "tasks"
								} to ${activeSprint?.name}.`,
							});
						}}
						disabled={selectedTasks.length < 1}
					>
						Assign {selectedTasks.length} Selected Task
						{selectedTasks.length !== 1 ? "s" : ""}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
