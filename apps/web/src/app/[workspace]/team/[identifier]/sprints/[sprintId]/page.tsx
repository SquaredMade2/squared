"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { useTeamStore, useTaskStore } from "@/store";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { AssignTasksDialog } from "@/components/Sprints";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Sprint, Task } from "@repo/db";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function SprintDashboardPage() {
	const { workspace, identifier, sprintId } = useParams();
	const { getSprints, sprints, currentTeam } = useTeamStore((state) => state);
	const { tasks, getAllTasks, updateTask } = useTaskStore((state) => state);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [sprintTasks, setSprintTasks] = useState<Task[]>([]);
	const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

	useEffect(() => {
		const loadData = async () => {
			if (currentTeam) {
				await getSprints(currentTeam.id);
				await getAllTasks(currentTeam.id);
			}
		};
		loadData();
	}, [currentTeam, getSprints, getAllTasks]);

	useEffect(() => {
		const currentSprint = sprints.find((s) => s.id === sprintId);
		setSprint(currentSprint || null);
		if (currentSprint) {
			setSprintTasks(
				tasks.filter((task) => task.sprintId === currentSprint.id),
			);
			setUnassignedTasks(tasks.filter((task) => !task.sprintId));
		}
	}, [sprints, tasks, sprintId]);

	const calculateProgress = () => {
		if (!sprint) return 0;
		const completedTasks = sprintTasks.filter((task) => task.status === "done");
		return sprintTasks.length > 0
			? (completedTasks.length / sprintTasks.length) * 100
			: 0;
	};

	const getBurndownData = () => {
		if (!sprint) return [];
		const sprintDays = differenceInDays(
			new Date(sprint.endDate),
			new Date(sprint.startDate),
		);
		const totalTasks = sprintTasks.length;
		return Array.from({ length: sprintDays + 1 }, (_, i) => {
			const date = new Date(sprint.startDate);
			date.setDate(date.getDate() + i);
			const completedTasks = sprintTasks.filter(
				(task) => task.status === "done" && new Date(task.updatedAt) <= date,
			).length;
			return {
				day: i,
				tasks: totalTasks - completedTasks,
				ideal: totalTasks - (totalTasks / sprintDays) * i,
			};
		});
	};

	const getTaskStatusData = () => {
		const statusCounts = sprintTasks.reduce(
			(acc, task) => {
				acc[task.status] = (acc[task.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(statusCounts).map(([status, count]) => ({
			name: status,
			value: count,
		}));
	};

	const handleBulkAssign = async () => {
		if (!sprint) return;
		for (const task of selectedTasks) {
			await updateTask(task.id, { sprintId: sprint.id });
		}
		setSelectedTasks([]);
		currentTeam && (await getAllTasks(currentTeam.id));
	};

	if (!sprint) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<div className="flex items-center justify-between">
				<Link href={`/${workspace}/team/${identifier}/sprints`} passHref>
					<Button variant="ghost" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Sprints
					</Button>
				</Link>
				<h1 className="text-3xl font-bold">{sprint.name}</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Sprint Progress</CardTitle>
					<CardDescription>
						{format(new Date(sprint.startDate), "PP")} -{" "}
						{format(new Date(sprint.endDate), "PP")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Progress value={calculateProgress()} className="w-full" />
					<p className="mt-2 text-sm text-muted-foreground">
						{Math.round(calculateProgress())}% Complete
					</p>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Burndown Chart</CardTitle>
					</CardHeader>
					<CardContent className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={getBurndownData()}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="day" />
								<YAxis />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="tasks"
									stroke="#8884d8"
									name="Actual"
								/>
								<Line
									type="monotone"
									dataKey="ideal"
									stroke="#82ca9d"
									name="Ideal"
									strokeDasharray="5 5"
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Task Status Distribution</CardTitle>
					</CardHeader>
					<CardContent className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={getTaskStatusData()}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
								>
									{getTaskStatusData().map((entry, index) => (
										<Cell
											key={`cell-${entry.value}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Sprint Statistics</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<h3 className="text-lg font-semibold">Total Tasks</h3>
							<p className="text-3xl font-bold">{sprintTasks.length}</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold">Completed Tasks</h3>
							<p className="text-3xl font-bold">
								{sprintTasks.filter((task) => task.status === "done").length}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold">In Progress</h3>
							<p className="text-3xl font-bold">
								{
									sprintTasks.filter((task) => task.status === "inProgress")
										.length
								}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold">To Do</h3>
							<p className="text-3xl font-bold">
								{sprintTasks.filter((task) => task.status === "todo").length}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-semibold">Sprint Tasks</h2>
				<AssignTasksDialog
					activeSprint={sprint}
					handleBulkAssign={handleBulkAssign}
					selectedTasks={selectedTasks}
					setSelectedTasks={setSelectedTasks}
					setTargetSprint={() => {}} // Not needed for single sprint view
					unassignedTasks={unassignedTasks}
					upcomingSprints={[]}
				/>
			</div>

			<Tabs defaultValue="all" className="w-full">
				<TabsList>
					<TabsTrigger value="all">All Tasks</TabsTrigger>
					<TabsTrigger value="todo">To Do</TabsTrigger>
					<TabsTrigger value="inProgress">In Progress</TabsTrigger>
					<TabsTrigger value="done">Done</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					<TaskList tasks={sprintTasks} />
				</TabsContent>
				<TabsContent value="todo">
					<TaskList
						tasks={sprintTasks.filter((task) => task.status === "todo")}
					/>
				</TabsContent>
				<TabsContent value="inProgress">
					<TaskList
						tasks={sprintTasks.filter((task) => task.status === "inProgress")}
					/>
				</TabsContent>
				<TabsContent value="done">
					<TaskList
						tasks={sprintTasks.filter((task) => task.status === "done")}
					/>
				</TabsContent>
			</Tabs>

			<Link href={`${sprintId}/retrospective`} passHref>
				<Button className="w-full mt-8">Start Sprint Retrospective</Button>
			</Link>
		</div>
	);
}

function TaskList({ tasks }: { tasks: Task[] }) {
	return (
		<div className="space-y-2">
			{tasks.map((task) => (
				<Card key={task.id}>
					<CardHeader>
						<CardTitle>{task.title}</CardTitle>
						<CardDescription>Status: {task.status}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{task.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
