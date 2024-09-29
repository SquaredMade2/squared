"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { format, differenceInDays } from "date-fns";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
import { useTaskStore, useTeamStore } from "@/store";
import type { Priority, Sprint, Task } from "@repo/db";
import { useParams } from "next/navigation";

export default function SprintDashboard() {
	const {
		currentTeam,
		sprints,
		getSprints,
		currentSprint,
		setCurrentSprint,
		teams,
		setCurrentTeam,
	} = useTeamStore((state) => state);
	const { tasks, getAllTasks, updateTask } = useTaskStore((state) => state);
	const [activeSprint, setActiveSprint] = useState<Sprint | null>(
		currentSprint,
	);
	const [upcomingSprints, setUpcomingSprints] = useState<Sprint[]>([]);
	const [completedSprints, setCompletedSprints] = useState<Sprint[]>([]);
	const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
	const [targetSprint, setTargetSprint] = useState<string>("");
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const { identifier } = useParams();

	useEffect(() => {
		const teamIdentifier = Array.isArray(identifier)
			? identifier[0]
			: identifier;
		if (currentTeam?.identifier !== teamIdentifier) {
			const newTeam = teams.find((team) => team.identifier === teamIdentifier);
			if (!newTeam) return;
			setCurrentTeam(newTeam);
		}
		if (currentTeam) {
			const initializeSprints = async () => {
				await getSprints(currentTeam.id);
				await getAllTasks(currentTeam.id);
			};
			initializeSprints();
		}
	}, [currentTeam, getSprints, getAllTasks]);

	useEffect(() => {
		if (sprints.length > 0) {
			const active = sprints.find((sprint) => sprint.status === "ACTIVE");
			const upcoming = sprints.filter((sprint) => sprint.status === "PLANNED");
			const completed = sprints.filter(
				(sprint) => sprint.status === "COMPLETED",
			);

			setActiveSprint(active || null);
			setUpcomingSprints(upcoming);
			setCompletedSprints(completed);

			if (active && (!currentSprint || currentSprint.id !== active.id)) {
				setCurrentSprint(active);
			}
		}
	}, [sprints, currentSprint, setCurrentSprint]);

	useEffect(() => {
		const unassigned = tasks.filter((task) => !task.sprintId);
		setUnassignedTasks(unassigned);
	}, [tasks]);

	const calculateProgress = (sprint: Sprint) => {
		if (!sprint) return 0;
		const totalDays = differenceInDays(
			new Date(sprint.endDate),
			new Date(sprint.startDate),
		);
		const elapsedDays = differenceInDays(
			new Date(),
			new Date(sprint.startDate),
		);
		return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
	};

	const getBurndownData = () => {
		if (!activeSprint) return [];
		const sprintDays = differenceInDays(
			new Date(activeSprint.endDate),
			new Date(activeSprint.startDate),
		);
		const totalTasks = tasks.filter(
			(task) => task.sprintId === activeSprint.id,
		).length;
		const data = [];
		for (let i = 0; i <= sprintDays; i++) {
			const date = new Date(activeSprint.startDate);
			date.setDate(date.getDate() + i);
			const completedTasks = tasks.filter(
				(task) =>
					task.sprintId === activeSprint.id &&
					task.status === "done" &&
					new Date(task.updatedAt) <= date,
			).length;
			data.push({
				day: i,
				tasks: totalTasks - completedTasks,
				ideal: totalTasks - (totalTasks / sprintDays) * i,
			});
		}
		return data;
	};

	const getVelocity = () => {
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
	};

	const getCapacity = () => {
		if (!activeSprint) return 0;
		return tasks.filter((task) => task.sprintId === activeSprint.id).length;
	};

	const handleTaskSelection = (taskId: Task) => {
		setSelectedTasks((prev) =>
			prev.includes(taskId)
				? prev.filter((id) => id !== taskId)
				: [...prev, taskId],
		);
	};

	const handleBulkAssign = async () => {
		if (!targetSprint) return;

		for (const task of selectedTasks) {
			await updateTask(task.id, { sprintId: targetSprint });
		}

		setSelectedTasks([]);
		setIsAssignModalOpen(false);
		currentTeam && (await getAllTasks(currentTeam.id));
	};

	const handleAutoAssign = async () => {
		if (!activeSprint) return;
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
		const tasksToAssign = unassignedTasks
			.sort((a, b) => mapPriority(a.priority) - mapPriority(b.priority))
			.slice(
				0,
				Math.max(
					(currentTeam?.tasksPerSprint || 10) -
						tasks.filter((t) => t.sprintId === activeSprint.id).length,
					0,
				),
			);
		for (const task of tasksToAssign) {
			await updateTask(task.id, { sprintId: activeSprint.id });
		}

		currentTeam && (await getAllTasks(currentTeam.id));
	};

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">Sprint Dashboard</h1>

			{activeSprint && (
				<Card>
					<CardHeader>
						<CardTitle>{activeSprint.name}</CardTitle>
						<CardDescription>
							{format(new Date(activeSprint.startDate), "PP")} -{" "}
							{format(new Date(activeSprint.endDate), "PP")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Progress
							value={calculateProgress(activeSprint)}
							className="w-full"
						/>
						<p className="mt-2 text-sm text-muted-foreground">
							{Math.round(calculateProgress(activeSprint))}% Complete
						</p>
					</CardContent>
				</Card>
			)}

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Burndown Chart</CardTitle>
					</CardHeader>
					<CardContent className="h-[300px]">
						<LineChart data={getBurndownData()}>
							<XAxis
								dataKey="day"
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `${value}`}
							/>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="tasks"
								stroke="#8884d8"
								strokeWidth={2}
							/>
							<Line
								type="monotone"
								dataKey="ideal"
								stroke="#82ca9d"
								strokeWidth={2}
								strokeDasharray="5 5"
							/>
						</LineChart>
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
					<Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
						<DialogTrigger asChild>
							<Button>Assign Tasks</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
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
								<ScrollArea className="h-[200px] w-full rounded-md border p-4">
									{unassignedTasks.map((task) => (
										<div key={task.id} className="flex items-center space-x-2">
											<Checkbox
												id={task.id}
												checked={selectedTasks.includes(task)}
												onCheckedChange={() => handleTaskSelection(task)}
											/>
											<label
												htmlFor={task.id}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{task.title}
											</label>
										</div>
									))}
								</ScrollArea>
							</div>
							<Button onClick={handleBulkAssign}>Assign Selected Tasks</Button>
						</DialogContent>
					</Dialog>
					<Button variant="outline" onClick={handleAutoAssign}>
						Auto-Assign Tasks
					</Button>
				</div>
			</div>

			<Tabs defaultValue="upcoming" className="w-full">
				<TabsList>
					<TabsTrigger value="upcoming">Upcoming Sprints</TabsTrigger>
					<TabsTrigger value="completed">Completed Sprints</TabsTrigger>
				</TabsList>
				<TabsContent value="upcoming">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{upcomingSprints.map((sprint) => (
							<Card key={sprint.id}>
								<CardHeader>
									<CardTitle>{sprint.name}</CardTitle>
									<CardDescription>
										{format(new Date(sprint.startDate), "PP")} -{" "}
										{format(new Date(sprint.endDate), "PP")}
									</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</TabsContent>
				<TabsContent value="completed">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{completedSprints.map((sprint) => (
							<Card key={sprint.id}>
								<CardHeader>
									<CardTitle>{sprint.name}</CardTitle>
									<CardDescription>
										{format(new Date(sprint.startDate), "PP")} -{" "}
										{format(new Date(sprint.endDate), "PP")}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p>
										{
											tasks.filter(
												(task) =>
													task.sprintId === sprint.id && task.status === "done",
											).length
										}{" "}
										tasks completed
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
