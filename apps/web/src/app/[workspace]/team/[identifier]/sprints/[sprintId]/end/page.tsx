"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { useParams } from "next/navigation";
import { useSprints } from "@/hooks/useSprints";
import { useTaskStore, useTeamStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
	SprintError,
	SprintLoading,
	SprintNotFound,
} from "@/components/Sprints";
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
import { TransferTaskModal } from "@/components/Sprints/TransferTaskModal";
import { parseParams } from "@/utils/parseParams";
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
import Link from "next/link";
import type { Task, Sprint } from "@squared/db";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function EndSprintPage() {
	const router = useRouter();
	const { sprintId } = useParams();
	const { sprints, team, workspace, loading, error } = useSprints();
	const { getAllTasks } = useTaskStore((state) => state);
	const { endSprint, getSprintTasks } = useTeamStore((state) => state);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);
	const [showTaskSelectionModal, setShowTaskSelectionModal] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");
	const [newSprint, setNewSprint] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [currentDay, setCurrentDay] = useState(0);
	const [burndownData, setBurndownData] = useState<
		{ day: number; tasks: number; ideal: number }[]
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
		if (currentSprint && team) {
			const loadSprintTasks = async () => {
				const tasks = await getSprintTasks(team?.id, parseParams(sprintId));
				setTasks(tasks);
			};
			loadSprintTasks();
			setNewSprintName(`Sprint ${sprints.length + 1}`);
		}
	}, [sprints, sprintId, team]);

	const getBurndownData = useCallback(() => {
		if (!sprint) return [];
		const sprintDays = differenceInDays(
			new Date(sprint.endDate),
			new Date(sprint.startDate),
		);
		const totalTasks = tasks.length;
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
				completedTasksCount = tasks.filter(
					(task) =>
						(task.status === "done" || task.status === "canceled") &&
						new Date(task.updatedAt) <= date,
				).length;
			} else {
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

	const handleEndSprintConfirm = async () => {
		if (!sprint || !team) return;

		try {
			if (newSprint) {
				setShowTaskSelectionModal(true);
			} else {
				const response = await endSprint(team.id, sprint.id);
				toast(response);
				router.push(`/${workspace?.url}/team/${team?.identifier}/all`);
			}
		} catch (error) {
			console.error("Error ending sprint:", error);
			toast({
				title: "Failed to end the sprint.",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		}
	};

	const handleButtonClick = (nextSprint: boolean) => {
		setNewSprint(nextSprint);
		setShowEndSprintDialog(true);
	};

	const getTaskStatusData = () => {
		const statusCounts = tasks.reduce(
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

	const calculateProgress = () => {
		if (!sprint) return 0;
		const completedTasks = tasks.filter(
			(task) => task.status === "done" || task.status === "canceled",
		);
		return tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
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
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">End Sprint: {sprint.name}</h1>
			<div className="grid gap-6 md:grid-cols-2">
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
				<Card>
					<CardHeader>
						<CardTitle>Sprint Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-lg font-semibold">Total Tasks</h3>
								<p className="text-3xl font-bold">{tasks.length}</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold">Completed Tasks</h3>
								<p className="text-3xl font-bold">
									{
										tasks.filter(
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
										tasks.filter(
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
									{tasks.filter((task) => task.status === "todo").length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
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
			<div className="flex justify-between items-center space-x-4">
				<Button
					onClick={() => handleButtonClick(false)}
					variant="outline"
					className="flex-1 border-destructive"
				>
					End Sprint
				</Button>
				<Link
					href={`/${workspace?.url}/team/${team?.identifier}/sprints/${sprintId}/retrospective`}
					className="flex-1"
					passHref
				>
					<Button className="w-full">Start Sprint Retrospective</Button>
				</Link>
				<Button onClick={() => handleButtonClick(true)} className="flex-1">
					Start Next Sprint
				</Button>
			</div>

			<AlertDialog
				open={showEndSprintDialog}
				onOpenChange={setShowEndSprintDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>End Sprint</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to end this sprint?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleEndSprintConfirm}>
							End Sprint
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<TransferTaskModal
				isOpen={showTaskSelectionModal}
				onClose={() => setShowTaskSelectionModal(false)}
				tasks={tasks.filter((t) =>
					["backlog", "todo", "inReview", "inProgress"].includes(t.status),
				)}
				team={team}
				initialSprintName={newSprintName}
				redirectUrl={`/${workspace?.url}/team/${team?.identifier}/sprints`}
			/>
		</div>
	);
}
