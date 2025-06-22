"use client";

import type { Priority, Sprint, Status, Task } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { Checkbox } from "@squaredmade/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@squaredmade/ui/dialog";
import { Input } from "@squaredmade/ui/input";
import { Label } from "@squaredmade/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { toast } from "@squaredmade/ui/toast";
import { useEffect, useId, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspaceStore } from "@/store";
import { PriorityIcon, StatusIcon } from "../Icons";
import LabelBadge from "../LabelBadges";

interface AssignTasksDialogProps {
	activeSprint: Sprint | null;
	upcomingSprints: Sprint[];
	unassignedTasks: Task[];
	selectedTasks: Task[];
	setSelectedTasks: (tasks: Task[]) => void;
	handleBulkAssign: () => void;
	setTargetSprint?: (sprintId: string) => void;
}

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
	const { workspace } = useWorkspaceStore((state) => state);

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
	const id = useId();
	const getFormId = (el: string) => `${id}-${el}`;

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
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
				<div className="flex grow flex-col gap-4 overflow-hidden px-6">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div className="mt-2 flex w-full items-center gap-2">
							<Label
								className="ml-auto hidden whitespace-nowrap sm:block"
								htmlFor={getFormId("sprint")}
							>
								Sprint
							</Label>
							<Select
								defaultValue={selectedSprintId}
								onValueChange={setTargetSprint}
							>
								<SelectTrigger
									className="w-full sm:w-72"
									id={getFormId("sprint")}
								>
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
						</div>
					</div>
					<div className="flex flex-col items-start gap-2 sm:gap-4">
						<Input
							className="grow"
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search tasks..."
							value={searchQuery}
						/>

						<div className="flex w-full items-center gap-2">
							<Select
								onValueChange={(value) => setFilterPriority(value as Priority)}
								value={filterPriority}
							>
								<SelectTrigger className="w-full">
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
								onValueChange={(value) => setFilterStatus(value as Status)}
								value={filterStatus}
							>
								<SelectTrigger className="w-full">
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
								onValueChange={(value) => setFilterLabel(value)}
								value={filterLabel}
							>
								<SelectTrigger className="w-full">
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
						</div>
					</div>
					<Tabs
						className="flex grow flex-col overflow-hidden"
						onValueChange={(value) => setViewMode(value as "list" | "grid")}
						value={viewMode}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="list">List View</TabsTrigger>
							<TabsTrigger value="grid">Grid View</TabsTrigger>
						</TabsList>
						<TabsContent className="mt-0 min-h-0" value="list">
							<ScrollArea className="scroll-area-no-table h-full w-full rounded-md border">
								<div className="w-full p-4">
									<div className="group flex w-full items-center rounded border-border border-b px-4 py-2 hover:bg-accent">
										<Checkbox
											checked={selectedTasks.length === filteredTasks.length}
											id={getFormId("select-all")}
											onCheckedChange={handleSelectAll}
										/>
										<Label
											className="ml-3 font-semibold"
											htmlFor={getFormId("select-all")}
										>
											Select All
										</Label>
									</div>
									{filteredTasks.map((task) => {
										const taskLabels = workspace?.labels.filter((label) =>
											task.labels.some(
												(taskLabel) => taskLabel.name === label.name,
											),
										);
										return (
											<div
												className="group flex w-full items-center justify-between rounded border-border border-b px-4 py-2 hover:bg-accent"
												key={task.id}
											>
												<div className="flex min-w-0 shrink items-center gap-2">
													<Checkbox
														checked={selectedTasks.includes(task)}
														className="mr-2 shrink-0"
														id={getFormId(task.id)}
														onCheckedChange={() => handleTaskSelection(task)}
													/>
													<PriorityIcon priority={task.priority} />
													<StatusIcon status={task.status} />
													<span className="truncate font-medium text-sm">
														{task.title}
													</span>
												</div>
												<div className="ml-2 hidden shrink-0 items-center justify-end gap-2 sm:flex">
													<div className="flex flex-row">
														{taskLabels?.map((label) => (
															<div className="mx-0.5" key={label.name}>
																<LabelBadge label={label} />
															</div>
														))}
													</div>
													{task.dueDate && (
														<span className="whitespace-nowrap text-muted-foreground text-xs">
															{new Date(task.dueDate).toLocaleDateString(
																"en-US",
																{
																	day: "numeric",
																	month: "short",
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
						<TabsContent className="mt-0 grow overflow-hidden" value="grid">
							<ScrollArea className="h-full w-full rounded-md border">
								<div className="p-4">
									<div className="mb-2 flex items-center">
										<Checkbox
											checked={selectedTasks.length === filteredTasks.length}
											id={getFormId("select-all-grid")}
											onCheckedChange={handleSelectAll}
										/>
										<Label
											className="ml-2"
											htmlFor={getFormId("select-all-grid")}
										>
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
													className="group flex flex-col rounded-lg border p-4 hover:bg-accent"
													key={task.id}
												>
													<div className="mb-2 flex items-center justify-between">
														<Checkbox
															checked={selectedTasks.includes(task)}
															id={getFormId(task.id)}
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
															<span className="mb-1 shrink" key={label.name}>
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
																	day: "numeric",
																	month: "short",
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
						disabled={selectedTasks.length === 0}
						onClick={() => {
							handleBulkAssign();
							setIsOpen(false);
							toast.success(
								`You successfully added ${selectedTasks.length} ${
									selectedTasks.length < 2 ? "task" : "tasks"
								} to ${activeSprint?.name}.`,
							);
						}}
					>
						Assign {selectedTasks.length} Selected Task
						{selectedTasks.length !== 1 ? "s" : ""}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
