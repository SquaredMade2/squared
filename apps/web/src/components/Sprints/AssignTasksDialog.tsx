import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Priority, Sprint, Status, Task } from "@repo/db";
import { PriorityIcon, StatusIcon } from "../Icons";

interface AssignTasksDialogProps {
	activeSprint: Sprint | null;
	upcomingSprints: Sprint[];
	unassignedTasks: Task[];
	selectedTasks: Task[];
	setSelectedTasks: (tasks: Task[]) => void;
	handleBulkAssign: () => void;
	setTargetSprint: (sprintId: string) => void;
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

	const handleTaskSelection = (task: Task) => {
		setSelectedTasks(
			selectedTasks.includes(task)
				? selectedTasks.filter((t) => t.id !== task.id)
				: [...selectedTasks, task],
		);
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

	const sortedTasks = unassignedTasks.sort((a, b) => {
		const priorityDiff = mapPriority(b.priority) - mapPriority(a.priority);
		if (priorityDiff !== 0) return priorityDiff;
		const statusDiff = mapStatus(b.status) - mapStatus(a.status);
		if (statusDiff !== 0) return statusDiff;
		return a.dueDate && b.dueDate
			? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
			: 0;
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Assign Tasks</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Assign Tasks to Sprint</DialogTitle>
					<DialogDescription>
						Select tasks and assign them to a sprint.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="sprint" className="text-right">
							Sprint
						</Label>
						<Select
							onValueChange={setTargetSprint}
							defaultValue={activeSprint?.id}
						>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select a sprint" />
							</SelectTrigger>
							<SelectContent>
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
					<ScrollArea className="h-[400px] w-full rounded-md border">
						{sortedTasks.map((task) => (
							<div
								key={task.id}
								className="group flex items-center w-full py-2 px-4 border-b border-border hover:bg-accent"
							>
								<Checkbox
									id={task.id}
									checked={selectedTasks.includes(task)}
									onCheckedChange={() => handleTaskSelection(task)}
									className="mr-2"
								/>
								<div className="flex-grow min-w-0">
									<div className="flex items-center gap-2">
										<PriorityIcon priority={task.priority} />
										<StatusIcon status={task.status} />
										<span className="truncate text-sm font-medium">
											{task.title}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2 ml-2">
									{task.dueDate && (
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{new Date(task.dueDate).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
									)}
								</div>
							</div>
						))}
					</ScrollArea>
				</div>
				<DialogFooter>
					<Button onClick={handleBulkAssign}>
						Assign {selectedTasks.length} Selected Task
						{selectedTasks.length !== 1 ? "s" : ""}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
