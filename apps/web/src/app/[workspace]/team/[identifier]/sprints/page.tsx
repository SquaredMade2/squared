"use client";

import { PriorityIcon } from "@/components/Icons";
import { AssignTasksDialog, SprintTabs } from "@/components/Sprints";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSprints } from "@/hooks/useSprints";
import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { TODO } from "@squared/context";
import type { Priority, Sprint, Task } from "@squared/db";
import { differenceInDays, format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function SprintDashboard() {
	const { sprints, currentSprint, team: currentTeam } = useSprints();
	const { tasks, setTasks } = useTaskStore((state) => state);
	const [upcomingSprints, setUpcomingSprints] = useState<Sprint[]>([]);
	const [completedSprints, setCompletedSprints] = useState<Sprint[]>([]);
	const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
	const [targetSprint, setTargetSprint] = useState<string | undefined>("");
	const [isAutoAssignConfirmOpen, setIsAutoAssignConfirmOpen] = useState(false);
	const [tasksToAutoAssign, setTasksToAutoAssign] = useState<Task[]>([]);
	const [isCustomizeAutoAssignOpen, setIsCustomizeAutoAssignOpen] =
		useState(false);
	const [customTaskCount, setCustomTaskCount] = useState("");
	const [currentDay, setCurrentDay] = useState(0);
	const [burndownData, setBurndownData] = useState<
		{
			day: number;
			tasks: number;
			ideal: number;
		}[]
	>([]);

	useEffect(() => {
		setTargetSprint(currentSprint?.id);
	}, [currentSprint]);

	useEffect(() => {
		if (sprints.length > 0) {
			const upcoming = sprints.filter((sprint) => sprint.status === "PLANNED");
			const completed = sprints.filter(
				(sprint) => sprint.status === "COMPLETED",
			);

			setUpcomingSprints(upcoming);
			setCompletedSprints(completed);
		}
	}, [sprints]);

	useEffect(() => {
		const unassigned = tasks.filter((task) => !task.sprintId);
		setUnassignedTasks(unassigned);
	}, [tasks]);

	const calculateProgress = useCallback(
		(sprint: Sprint) => {
			const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
			const completedTasks = sprintTasks.filter(
				(task) => task.status === "done",
			);

			if (sprintTasks.length === 0) return 0; // Avoid division by zero

			const progress = (completedTasks.length / sprintTasks.length) * 100;
			return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
		},
		[tasks],
	);

	const getBurndownData = useCallback(() => {
		if (!currentSprint) return [];

		const sprintTasks = tasks.filter(
			(task) => task.sprintId === currentSprint.id,
		);
		const sprintDays = differenceInDays(
			new Date(currentSprint.endDate),
			new Date(currentSprint.startDate),
		);
		const totalTasks = sprintTasks.length;
		const today = new Date();
		const currentSprintDay = differenceInDays(
			today,
			new Date(currentSprint.startDate),
		);

		// Calculate the number of completed tasks so far
		const completedTasksSoFar = sprintTasks.filter(
			(task) =>
				(task.status === "done" || task.status === "canceled") &&
				new Date(task.updatedAt) <= today,
		).length;

		// Calculate the average completion rate per day so far
		const averageCompletionRate = completedTasksSoFar / (currentSprintDay + 1);

		let completedTasksCount = completedTasksSoFar;

		const data = Array.from({ length: sprintDays + 1 }, (_, i) => {
			const date = new Date(currentSprint.startDate);
			date.setDate(date.getDate() + i);

			if (i > currentSprintDay) {
				// Project future completion based on the actual rate
				completedTasksCount += averageCompletionRate;
			} else {
				completedTasksCount = sprintTasks.filter(
					(task) =>
						(task.status === "done" || task.status === "canceled") &&
						new Date(task.updatedAt) <= date,
				).length;
			}

			return {
				day: i,
				tasks: Math.max(0, totalTasks - completedTasksCount),
				ideal: totalTasks - (totalTasks / sprintDays) * i,
			};
		});

		return data;
	}, [currentSprint, tasks]);

	useEffect(() => {
		setCurrentDay(
			currentSprint
				? differenceInDays(new Date(), new Date(currentSprint.startDate))
				: 0,
		);
		setBurndownData(getBurndownData());
	}, [currentSprint, getBurndownData]);

	const getVelocity = useCallback(() => {
		if (completedSprints.length === 0) return 0;
		const totalCompletedTasks = completedSprints.reduce((sum, sprint) => {
			return (
				sum +
				tasks.filter(
					(task) => task.sprintId === sprint.id && task.status === "done",
				).length
			);
		}, 0);
		return totalCompletedTasks / completedSprints.length;
	}, [completedSprints, tasks]);

	const getCapacity = useCallback(() => {
		if (!currentSprint) return 0;
		return tasks.filter((task) => task.sprintId === currentSprint.id).length;
	}, [currentSprint, tasks]);

	const handleBulkAssign = async () => {
		if (!targetSprint) return;

		await taskService.addSprintTasks(TODO, {
			sprintId: targetSprint,
			taskIds: selectedTasks.map((t) => t.id),
		});

		setSelectedTasks([]);
		currentTeam &&
			setTasks(
				await taskService.getTeamTasks(TODO, { teamId: currentTeam.id }),
			);
	};

	const prepareAutoAssign = () => {
		if (!currentSprint) return;
		const defaultTaskCount = Math.max(
			(currentTeam?.tasksPerSprint || 10) -
				tasks.filter((t) => t.sprintId === currentSprint.id).length,
			0,
		);
		setCustomTaskCount(defaultTaskCount.toString());
		setIsCustomizeAutoAssignOpen(true);
	};

	const handleCustomizeAutoAssign = () => {
		if (!currentSprint) return;
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
		const taskCount = Number.parseInt(customTaskCount, 10) || 0;
		const tasksToAssign = unassignedTasks
			.sort((a, b) => mapPriority(b.priority) - mapPriority(a.priority))
			.slice(0, taskCount);
		setTasksToAutoAssign(tasksToAssign);
		setIsCustomizeAutoAssignOpen(false);
		setIsAutoAssignConfirmOpen(true);
	};

	const handleAutoAssign = async () => {
		if (!currentSprint) return;
		await taskService.addSprintTasks(TODO, {
			sprintId: currentSprint.id,
			taskIds: tasksToAutoAssign.map((t) => t.id),
		});
		setIsAutoAssignConfirmOpen(false);
		currentTeam &&
			setTasks(
				await taskService.getTeamTasks(TODO, { teamId: currentTeam.id }),
			);
	};

	return (
		<ScrollArea className="container mx-auto p-4 overflow-y-auto h-[100vh]">
			<div className="space-y-6">
				<h1 className="text-3xl font-bold">Sprint Dashboard</h1>
				{currentSprint && (
					<Card>
						<CardHeader>
							<CardTitle>{currentSprint.name}</CardTitle>
							<CardDescription>
								{format(new Date(currentSprint.startDate), "PP")} -{" "}
								{format(new Date(currentSprint.endDate), "PP")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Progress
								value={calculateProgress(currentSprint)}
								className="w-full"
							/>
							<p className="mt-2 text-sm text-muted-foreground">
								{Math.round(calculateProgress(currentSprint))}% Complete
							</p>
						</CardContent>
					</Card>
				)}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Burndown Chart</CardTitle>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={burndownData}
									margin={{ top: 15, right: 20, left: 20, bottom: 5 }}
								>
									<XAxis dataKey="day" tick={false} axisLine={false} />
									<YAxis hide={true} />
									<Tooltip
										contentStyle={{
											background: "hsl(var(--card))",
											border: "none",
											borderRadius: "8px",
										}}
										labelStyle={{ color: "hsl(var(--muted-foreground))" }}
										formatter={(value) => Math.floor(Number(value))}
									/>
									<Line
										type="monotone"
										dataKey="tasks"
										stroke="hsl(var(--primary))"
										strokeWidth={2}
										dot={false}
										name="Actual"
									/>
									<Line
										type="monotone"
										dataKey="ideal"
										stroke="hsl(var(--muted))"
										strokeWidth={2}
										strokeDasharray="5 5"
										dot={false}
										name="Ideal"
									/>
									<ReferenceLine
										x={currentDay}
										stroke="hsl(var(--destructive))"
										strokeWidth={1}
										label={{
											value: "Today",
											position: "top",
											fill: "hsl(var(--destructive))",
										}}
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Velocity</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-4xl font-bold">{getVelocity().toFixed(1)}</p>
							<p className="text-sm text-muted-foreground">Tasks per sprint</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Capacity</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-4xl font-bold">{getCapacity()}</p>
							<p className="text-sm text-muted-foreground">
								Tasks in current sprint
							</p>
						</CardContent>
					</Card>
				</div>
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold">Task Assignment</h2>
					<div className="space-x-2">
						<AssignTasksDialog
							activeSprint={currentSprint}
							handleBulkAssign={handleBulkAssign}
							selectedTasks={selectedTasks}
							setSelectedTasks={setSelectedTasks}
							setTargetSprint={setTargetSprint}
							unassignedTasks={unassignedTasks}
							upcomingSprints={upcomingSprints}
						/>
						<Button variant="outline" onClick={prepareAutoAssign}>
							Auto-Assign Tasks
						</Button>
					</div>
				</div>
				<AlertDialog
					open={isCustomizeAutoAssignOpen}
					onOpenChange={setIsCustomizeAutoAssignOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Customize Auto-Assignment</AlertDialogTitle>
							<AlertDialogDescription>
								Enter the number of tasks you want to auto-assign to the current
								sprint.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<div className="py-4">
							<Input
								type="number"
								value={customTaskCount}
								onChange={(e) => setCustomTaskCount(e.target.value)}
								placeholder="Number of tasks to assign"
							/>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleCustomizeAutoAssign}>
								Proceed
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<Dialog
					open={isAutoAssignConfirmOpen}
					onOpenChange={setIsAutoAssignConfirmOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Auto-Assign Tasks</DialogTitle>
							<DialogDescription>
								Are you sure you want to auto-assign the following tasks to the
								current sprint?
							</DialogDescription>
						</DialogHeader>
						<ScrollArea className="h-[200px] w-full rounded-md border p-4">
							{tasksToAutoAssign.map((task) => (
								<div key={task.id} className="flex items-center space-x-2 mb-2">
									<PriorityIcon priority={task.priority} />
									<span className="text-sm">{task.title}</span>
								</div>
							))}
						</ScrollArea>
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Auto-Assign</AlertTitle>
							<AlertDescription>
								This will assign {tasksToAutoAssign.length} task
								{tasksToAutoAssign.length !== 1 ? "s" : ""} to the current
								sprint.
							</AlertDescription>
						</Alert>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsAutoAssignConfirmOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleAutoAssign}>Confirm Auto-Assign</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<SprintTabs
					upcomingSprints={upcomingSprints}
					completedSprints={completedSprints}
					activeSprint={currentSprint}
					tasks={tasks}
					calculateProgress={calculateProgress}
				/>
			</div>
		</ScrollArea>
	);
}
