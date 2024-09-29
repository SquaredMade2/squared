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
import type { Sprint } from "@repo/db";

export default function SprintDashboard() {
	const { currentTeam, sprints, getSprints, currentSprint, setCurrentSprint } =
		useTeamStore((state) => state);
	const { tasks, getAllTasks } = useTaskStore((state) => state);
	const [activeSprint, setActiveSprint] = useState<Sprint | undefined>(
		undefined,
	);
	const [upcomingSprints, setUpcomingSprints] = useState<Sprint[]>([]);
	const [completedSprints, setCompletedSprints] = useState<Sprint[]>([]);

	useEffect(() => {
		if (currentTeam) {
			getSprints(currentTeam.id);
			getAllTasks(currentTeam.id);
		}
	}, [currentTeam, getSprints, getAllTasks]);

	useEffect(() => {
		if (sprints.length > 0) {
			const active = sprints.find((sprint) => sprint.status === "ACTIVE");
			const upcoming = sprints.filter((sprint) => sprint.status === "PLANNED");
			const completed = sprints.filter(
				(sprint) => sprint.status === "COMPLETED",
			);

			setActiveSprint(active);
			setUpcomingSprints(upcoming);
			setCompletedSprints(completed);

			if (active && (!currentSprint || currentSprint.id !== active.id)) {
				setCurrentSprint(active);
			}
		}
	}, [sprints, currentSprint, setCurrentSprint]);

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
