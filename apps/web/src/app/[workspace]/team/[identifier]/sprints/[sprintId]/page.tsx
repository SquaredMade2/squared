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
} from "recharts";
import { AssignTasksDialog } from "@/components/Sprints";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Sprint, Task } from "@repo/db";

export default function SprintDashboardPage() {
	const { team, sprintId } = useParams();
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
		const data = [];
		for (let i = 0; i <= sprintDays; i++) {
			const date = new Date(sprint.startDate);
			date.setDate(date.getDate() + i);
			const completedTasks = sprintTasks.filter(
				(task) => task.status === "done" && new Date(task.updatedAt) <= date,
			).length;
			data.push({
				day: i,
				tasks: totalTasks - completedTasks,
				ideal: totalTasks - (totalTasks / sprintDays) * i,
			});
		}
		return data;
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
				<Link href={`/${team}/sprints`} passHref>
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
						<CardTitle>Sprint Statistics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p>Total Tasks: {sprintTasks.length}</p>
							<p>
								Completed Tasks:{" "}
								{sprintTasks.filter((task) => task.status === "done").length}
							</p>
							<p>
								Remaining Tasks:{" "}
								{sprintTasks.filter((task) => task.status !== "done").length}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

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
