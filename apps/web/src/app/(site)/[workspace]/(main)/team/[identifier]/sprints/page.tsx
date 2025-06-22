"use client";

import type { Priority, Sprint, Task } from "@squaredmade/db";
import { CircleAlert } from "@squaredmade/icons";
import { Alert, AlertDescription, AlertTitle } from "@squaredmade/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@squaredmade/ui/alert-dialog";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import { Input } from "@squaredmade/ui/input";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { differenceInDays, format } from "date-fns";
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
import { PriorityIcon } from "@/components/Icons";
import { AssignTasksDialog, SprintTabs } from "@/components/Sprints";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSprints } from "@/hooks/useSprints";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
export default function SprintDashboard() {
	const { sprints, sprint, team: currentTeam } = useSprints();
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
	useWorkspaces();

	useEffect(() => {
		setTargetSprint(sprint?.id);
	}, [sprint]);

	useEffect(() => {
		if (sprints.length > 0) {
			const upcoming = sprints.filter((s) => s.status === "PLANNED");
			const completed = sprints.filter((s) => s.status === "COMPLETED");

			setUpcomingSprints(upcoming);
			setCompletedSprints(completed);
		}
	}, [sprints]);

	useEffect(() => {
		const unassigned = tasks.filter((task) => !task.sprintId);
		setUnassignedTasks(unassigned);
	}, [tasks]);

	const calculateProgress = useCallback(
		(s: Sprint) => {
			const sprintTasks = tasks.filter((task) => task.sprintId === s.id);
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
		if (!sprint) return [];

		const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
		const sprintDays = differenceInDays(
			new Date(sprint.endDate),
			new Date(sprint.startDate),
		);
		const totalTasks = sprintTasks.length;
		const today = new Date();
		const currentSprintDay = differenceInDays(
			today,
			new Date(sprint.startDate),
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
			const date = new Date(sprint.startDate);
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
				ideal: totalTasks - (totalTasks / sprintDays) * i,
				tasks: Math.max(0, totalTasks - completedTasksCount),
			};
		});

		return data;
	}, [sprint, tasks]);

	useEffect(() => {
		setCurrentDay(
			sprint ? differenceInDays(new Date(), new Date(sprint.startDate)) : 0,
		);
		setBurndownData(getBurndownData());
	}, [sprint, getBurndownData]);

	const getVelocity = useCallback(() => {
		if (completedSprints.length === 0) return 0;
		const totalCompletedTasks = completedSprints.reduce((sum, s) => {
			return (
				sum +
				tasks.filter((task) => task.sprintId === s.id && task.status === "done")
					.length
			);
		}, 0);
		return totalCompletedTasks / completedSprints.length;
	}, [completedSprints, tasks]);

	const getCapacity = useCallback(() => {
		if (!sprint) return 0;
		return tasks.filter((task) => task.sprintId === sprint.id).length;
	}, [sprint, tasks]);

	const { mutate: handleBulkAssign } = useMutation({
		mutationFn: async () => {
			if (!targetSprint) throw new Error("Sprint not found");
			if (!currentTeam) throw new Error("Team not found");
			await client.sprint.addSprintTasks.$post({
				sprintId: targetSprint,
				taskIds: selectedTasks.map((t) => t.id),
			});
		},
		mutationKey: ["task", "addSprintTasks", targetSprint],
		onError: (error) => {
			toast.error("Error Assigning Tasks", {
				description: error.message,
			});
		},
		onSuccess: async () => {
			setSelectedTasks([]);
			if (!currentTeam) return;
			setTasks(
				await client.task.getAllTasks
					.$get({ teamId: currentTeam.id })
					.then((res) => res.json()),
			);
		},
	});

	const prepareAutoAssign = () => {
		if (!sprint) return;
		const defaultTaskCount = Math.max(
			(currentTeam?.tasksPerSprint || 10) -
				tasks.filter((t) => t.sprintId === sprint.id).length,
			0,
		);
		setCustomTaskCount(defaultTaskCount.toString());
		setIsCustomizeAutoAssignOpen(true);
	};

	const handleCustomizeAutoAssign = () => {
		if (!sprint) return;
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

	const { mutate: handleAutoAssign } = useMutation({
		mutationFn: async () => {
			if (!targetSprint) throw new Error("Sprint not found");
			if (!currentTeam) throw new Error("Team not found");
			await client.sprint.addSprintTasks.$post({
				sprintId: targetSprint,
				taskIds: tasksToAutoAssign.map((t) => t.id),
			});
		},
		mutationKey: ["task", "addSprintTasks", targetSprint],
		onError: (error) => {
			toast.error("Error Auto-Assigning Tasks", {
				description: error.message,
			});
		},
		onSuccess: async () => {
			setIsAutoAssignConfirmOpen(false);
			if (!currentTeam) return;
			setTasks(
				await client.task.getAllTasks
					.$get({ teamId: currentTeam.id })
					.then((res) => res.json()),
			);
		},
	});

	return (
		<ScrollArea className="container mx-auto h-[100vh] w-full overflow-y-auto p-4">
			<div className="space-y-6">
				<h1 className="ml-8 font-bold text-3xl">Sprint Dashboard</h1>
				{sprint && (
					<Card>
						<CardHeader>
							<CardTitle>{sprint.name}</CardTitle>
							<CardDescription>
								{format(new Date(sprint.startDate), "PP")} -{" "}
								{format(new Date(sprint.endDate), "PP")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Progress className="w-full" value={calculateProgress(sprint)} />
							<p className="mt-2 text-muted-foreground text-sm">
								{Math.round(calculateProgress(sprint))}% Complete
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
							<ResponsiveContainer height="100%" width="100%">
								<LineChart
									data={burndownData}
									margin={{ bottom: 5, left: 20, right: 20, top: 15 }}
								>
									<XAxis axisLine={false} dataKey="day" tick={false} />
									<YAxis hide />
									<Tooltip
										contentStyle={{
											background: "var(--background)",
											border: "none",
											borderRadius: "8px",
										}}
										formatter={(value) => Math.floor(Number(value))}
									/>
									<Line
										dataKey="tasks"
										dot={false}
										name="Actual"
										stroke="var(--primary)"
										strokeWidth={2}
										type="monotone"
									/>
									<Line
										dataKey="ideal"
										dot={false}
										name="Ideal"
										stroke="var(--muted-foreground)"
										strokeDasharray="5 5"
										strokeWidth={2}
										type="monotone"
									/>
									<ReferenceLine
										label={{
											fill: "var(--destructive)",
											position: "top",
											value: "Today",
										}}
										stroke="var(--destructive)"
										strokeWidth={1}
										x={currentDay}
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
							<p className="font-bold text-4xl">{getVelocity().toFixed(1)}</p>
							<p className="text-muted-foreground text-sm">Tasks per sprint</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Capacity</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="font-bold text-4xl">{getCapacity()}</p>
							<p className="text-muted-foreground text-sm">
								Tasks in current sprint
							</p>
						</CardContent>
					</Card>
				</div>
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-2xl">Task Assignment</h2>
					<div className="space-x-2">
						<AssignTasksDialog
							activeSprint={sprint || null}
							handleBulkAssign={() => handleBulkAssign()}
							selectedTasks={selectedTasks}
							setSelectedTasks={setSelectedTasks}
							setTargetSprint={setTargetSprint}
							unassignedTasks={unassignedTasks}
							upcomingSprints={upcomingSprints}
						/>
						<Button onClick={prepareAutoAssign} variant="outline">
							Auto-Assign Tasks
						</Button>
					</div>
				</div>
				<AlertDialog
					onOpenChange={setIsCustomizeAutoAssignOpen}
					open={isCustomizeAutoAssignOpen}
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
								onChange={(e) => setCustomTaskCount(e.target.value)}
								placeholder="Number of tasks to assign"
								type="number"
								value={customTaskCount}
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
					onOpenChange={setIsAutoAssignConfirmOpen}
					open={isAutoAssignConfirmOpen}
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
								<div className="mb-2 flex items-center space-x-2" key={task.id}>
									<PriorityIcon priority={task.priority} />
									<span className="text-sm">{task.title}</span>
								</div>
							))}
						</ScrollArea>
						<Alert>
							<CircleAlert className="h-4 w-4" />
							<AlertTitle>Auto-Assign</AlertTitle>
							<AlertDescription>
								This will assign {tasksToAutoAssign.length} task
								{tasksToAutoAssign.length !== 1 ? "s" : ""} to the current
								sprint.
							</AlertDescription>
						</Alert>
						<DialogFooter>
							<Button
								onClick={() => setIsAutoAssignConfirmOpen(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button onClick={() => handleAutoAssign()}>
								Confirm Auto-Assign
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<SprintTabs
					activeSprint={sprint || null}
					calculateProgress={calculateProgress}
					completedSprints={completedSprints}
					tasks={tasks}
					upcomingSprints={upcomingSprints}
				/>
			</div>
		</ScrollArea>
	);
}
