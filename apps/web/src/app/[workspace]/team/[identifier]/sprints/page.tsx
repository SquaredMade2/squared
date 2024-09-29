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
	DialogFooter,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AssignTasksDialog } from "@/components/Sprints";

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
	const [isAutoAssignConfirmOpen, setIsAutoAssignConfirmOpen] = useState(false);
	const [tasksToAutoAssign, setTasksToAutoAssign] = useState<Task[]>([]);
	const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
		"upcoming",
	);
	const { identifier } = useParams();

	const renderSprintCard = (sprint: Sprint, isActive = false) => {
		const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
		const completedTasks = sprintTasks.filter((task) => task.status === "done");
		const carriedOverTasks = isActive
			? tasks.filter(
					(task) =>
						task.sprintId === sprint.id &&
						new Date(task.dateCreated) < new Date(sprint.startDate),
				)
			: [];
		const plannedTasks = sprintTasks.length;

		return (
			<Card key={sprint.id} className="w-full mb-4">
				<CardHeader>
					<CardTitle>{sprint.name}</CardTitle>
					<CardDescription>
						{format(new Date(sprint.startDate), "PP")} -{" "}
						{format(new Date(sprint.endDate), "PP")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isActive && (
						<div className="mb-4">
							<Progress value={calculateProgress(sprint)} className="w-full" />
							<p className="text-sm text-muted-foreground mt-2">
								{Math.round(calculateProgress(sprint))}% Complete
							</p>
						</div>
					)}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<h4 className="font-semibold mb-1">Completed Tasks</h4>
							<p>{completedTasks.length}</p>
						</div>
						{isActive && (
							<div>
								<h4 className="font-semibold mb-1">Carried Over Tasks</h4>
								<p>{carriedOverTasks.length}</p>
							</div>
						)}
						{!isActive && (
							<div>
								<h4 className="font-semibold mb-1">Planned Tasks</h4>
								<p>{plannedTasks}</p>
							</div>
						)}
						<div>
							<h4 className="font-semibold mb-1">Total Tasks</h4>
							<p>{sprintTasks.length}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

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
		const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
		const completedTasks = sprintTasks.filter((task) => task.status === "done");

		if (sprintTasks.length === 0) return 0; // Avoid division by zero

		const progress = (completedTasks.length / sprintTasks.length) * 100;
		return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
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

	const handleBulkAssign = async () => {
		if (!targetSprint) return;

		for (const task of selectedTasks) {
			await updateTask(task.id, { sprintId: targetSprint });
		}

		setSelectedTasks([]);
		currentTeam && (await getAllTasks(currentTeam.id));
	};

	const prepareAutoAssign = () => {
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
			.sort((a, b) => mapPriority(b.priority) - mapPriority(a.priority))
			.slice(
				0,
				Math.max(
					(currentTeam?.tasksPerSprint || 10) -
						tasks.filter((t) => t.sprintId === activeSprint.id).length,
					0,
				),
			);
		setTasksToAutoAssign(tasksToAssign);
		setIsAutoAssignConfirmOpen(true);
	};

	const handleAutoAssign = async () => {
		if (!activeSprint) return;
		for (const task of tasksToAutoAssign) {
			await updateTask(task.id, { sprintId: activeSprint.id });
		}
		setIsAutoAssignConfirmOpen(false);
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
					<AssignTasksDialog
						activeSprint={activeSprint}
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
								<span className="text-sm">{task.title}</span>
								<span
									className={`ml-auto text-xs px-2 py-1 rounded-full ${
										task.priority === "urgent"
											? "bg-red-100 text-red-800"
											: task.priority === "high"
												? "bg-orange-100 text-orange-800"
												: task.priority === "medium"
													? "bg-yellow-100 text-yellow-800"
													: task.priority === "low"
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
									}`}
								>
									{task.priority}
								</span>
							</div>
						))}
					</ScrollArea>
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Auto-Assign</AlertTitle>
						<AlertDescription>
							This will assign {tasksToAutoAssign.length} task
							{tasksToAutoAssign.length !== 1 ? "s" : ""} to the current sprint.
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

			<Tabs
				defaultValue="upcoming"
				className="w-full"
				onValueChange={(value) =>
					setActiveTab(value as "upcoming" | "completed")
				}
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upcoming">Upcoming Sprints</TabsTrigger>
					<TabsTrigger value="completed">Completed Sprints</TabsTrigger>
				</TabsList>
				<div className="h-[600px] mt-4">
					<ScrollArea className="h-full">
						<TabsContent
							value="upcoming"
							className={activeTab === "upcoming" ? "" : "hidden"}
						>
							{activeSprint && (
								<>
									<h3 className="text-lg font-semibold mb-2">Active Sprint</h3>
									{renderSprintCard(activeSprint, true)}
								</>
							)}
							<h3 className="text-lg font-semibold mb-2">Upcoming Sprints</h3>
							{upcomingSprints.map((sprint) => renderSprintCard(sprint))}
						</TabsContent>
						<TabsContent
							value="completed"
							className={activeTab === "completed" ? "" : "hidden"}
						>
							{completedSprints.map((sprint) => renderSprintCard(sprint))}
						</TabsContent>
					</ScrollArea>
				</div>
			</Tabs>
		</div>
	);
}
