"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { useTaskStore } from "@/store";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	ReferenceLine,
} from "recharts";
import {
	AssignTasksDialog,
	SprintError,
	SprintLoading,
	SprintNotFound,
} from "@/components/Sprints";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Sprint, Status, Task } from "@repo/db";
import { useSprints } from "@/hooks/useSprints";
import { formatStatus } from "@/utils/formatting";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function SprintDashboardPage() {
	const { sprintId } = useParams();
	const { sprints, team, workspace, loading, error } = useSprints();
	const { tasks, getAllTasks, updateTask } = useTaskStore((state) => state);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [sprintTasks, setSprintTasks] = useState<Task[]>([]);
	const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
	const [currentDay, setCurrentDay] = useState(0);
	const [burndownData, setBurndownData] = useState<
		{
			day: number;
			tasks: number;
			ideal: number;
		}[]
	>([]);

	useEffect(() => {
		const loadData = async () => {
			if (team) {
				await getAllTasks(team.id);
			}
		};
		loadData();
	}, [team]);

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
		const completedTasks = sprintTasks.filter(
			(task) => task.status === "done" || task.status === "canceled",
		);
		return sprintTasks.length > 0
			? (completedTasks.length / sprintTasks.length) * 100
			: 0;
	};

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

		let completedTasksCount = 0;
		const data = Array.from({ length: sprintDays + 1 }, (_, i) => {
			const date = new Date(sprint.startDate);
			date.setDate(date.getDate() + i);

			if (i <= currentSprintDay) {
				completedTasksCount = sprintTasks.filter(
					(task) =>
						(task.status === "done" || task.status === "canceled") &&
						new Date(task.updatedAt) <= date,
				).length;
			} else {
				// Project future based on current rate
				const remainingDays = sprintDays - currentSprintDay;
				const remainingTasks = totalTasks - completedTasksCount;
				const dailyRate = remainingTasks / remainingDays;
				completedTasksCount += dailyRate;
			}

			return {
				day: i,
				tasks: Math.max(0, totalTasks - completedTasksCount),
				ideal: totalTasks - (totalTasks / sprintDays) * i,
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

	const getTaskStatusData = () => {
		const statusCounts = sprintTasks.reduce(
			(acc, task) => {
				acc[task.status] = (acc[task.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(statusCounts).map(([status, count]) => ({
			name: formatStatus(status as Status),
			value: count,
		}));
	};

	const handleBulkAssign = async () => {
		if (!sprint) return;
		for (const task of selectedTasks) {
			await updateTask(task.id, {
				sprintId: sprint.id,
				status: task.status === "backlog" ? "todo" : task.status,
			});
		}
		setSelectedTasks([]);
		team && (await getAllTasks(team.id));
	};

	if (loading) {
		return <SprintLoading />;
	}
	if (error) {
		return (
			<SprintError
				error={error}
				workspaceUrl={workspace?.url}
				teamIdentifier={team?.identifier}
			/>
		);
	}
	if (!sprint) {
		return (
			<SprintNotFound
				workspaceUrl={workspace?.url}
				teamIdentifier={team?.identifier}
			/>
		);
	}

	return (
		<ScrollArea className="container mx-auto p-4 overflow-y-auto h-[100vh]">
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<Link
						href={`/${workspace?.url}/team/${team?.identifier}/sprints`}
						passHref
					>
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
									{
										sprintTasks.filter(
											(task) =>
												task.status === "done" || task.status === "canceled",
										).length
									}
								</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold">In Progress</h3>
								<p className="text-3xl font-bold">
									{
										sprintTasks.filter(
											(task) =>
												task.status === "inProgress" ||
												task.status === "inReview",
										).length
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
							tasks={sprintTasks.filter(
								(task) =>
									task.status === "inProgress" || task.status === "inReview",
							)}
						/>
					</TabsContent>
					<TabsContent value="done">
						<TaskList
							tasks={sprintTasks.filter(
								(task) => task.status === "done" || task.status === "canceled",
							)}
						/>
					</TabsContent>
				</Tabs>

				<Link href={`${sprintId}/retrospective`} passHref>
					<Button className="w-full my-8">Start Sprint Retrospective</Button>
				</Link>
			</div>
		</ScrollArea>
	);
}

function TaskList({ tasks }: { tasks: Task[] }) {
	return (
		<div className="space-y-2">
			{tasks.map((task) => (
				<Card key={task.id}>
					<CardHeader>
						<CardTitle>{task.title}</CardTitle>
						<CardDescription>
							Status: {formatStatus(task.status)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{task.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
