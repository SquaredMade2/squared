"use client";

import { differenceInDays, format } from "date-fns";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import {
	AssignTasksDialog,
	SprintError,
	SprintLoading,
	SprintNotFound,
} from "@/components/Sprints";
import { TransferTaskModal } from "@/components/Sprints/TransferTaskModal";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

import { useSprints } from "@/hooks/useSprints";
import { sprintService, taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import type { Sprint, Status, Task } from "@squared/db";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#EF4444"];

export default function SprintDashboardPage() {
	const { sprintId } = useParams();
	const router = useRouter();
	const { sprints, team, workspace, loading, error, sprintTasks } = useSprints(
		parseParams(sprintId),
	);
	const { tasks, setTasks } = useTaskStore((state) => state);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
	const [currentDay, setCurrentDay] = useState(0);
	const [burndownData, setBurndownData] = useState<
		{ day: number; tasks: number; ideal: number }[]
	>([]);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);
	const [showTaskSelectionModal, setShowTaskSelectionModal] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");
	const [newSprint, setNewSprint] = useState(false);

	useEffect(() => {
		const currentSprint = sprints.find((s) => s.id === sprintId);
		setSprint(currentSprint || null);
		if (currentSprint) {
			setUnassignedTasks(tasks.filter((task) => !task.sprintId));
		}
		if (currentSprint && team) {
			setNewSprintName(`Sprint ${sprints.length + 1}`);
		}
	}, [sprints, tasks, sprintId, team]);

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
	}, [sprint, sprintTasks]);

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
		await taskService.addSprintTasks(TODO, {
			sprintId: sprint.id,
			taskIds: selectedTasks.map((t) => t.id),
		});
		setSelectedTasks([]);
		team && setTasks(await taskService.getTeamTasks(TODO, { teamId: team.id }));
	};

	const handleEndSprintConfirm = async () => {
		if (!sprint || !team) return;

		try {
			if (newSprint) {
				setShowTaskSelectionModal(true);
			} else {
				await sprintService.endSprint(TODO, {
					sprintId: sprint.id,
				});
				toast({ title: "Sprint ended successfully" });
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
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Sprint: {sprint.name}</h1>
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
											key={`cell-${entry.name}-${entry.value}`}
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
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-semibold">Sprint Tasks</h2>
				<div className="space-x-4">
					<AssignTasksDialog
						activeSprint={sprint}
						handleBulkAssign={handleBulkAssign}
						selectedTasks={selectedTasks}
						setSelectedTasks={setSelectedTasks}
						unassignedTasks={unassignedTasks}
						upcomingSprints={[]}
					/>
				</div>
			</div>
			<Tabs defaultValue="all" className="w-full">
				<TabsList className="w-full">
					<TabsTrigger value="all" className="flex-1">
						All Tasks
					</TabsTrigger>
					<TabsTrigger value="todo" className="flex-1">
						To Do
					</TabsTrigger>
					<TabsTrigger value="inProgress" className="flex-1">
						In Progress
					</TabsTrigger>
					<TabsTrigger value="done" className="flex-1">
						Done
					</TabsTrigger>
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
				tasks={sprintTasks.filter((t) =>
					["backlog", "todo", "inReview", "inProgress"].includes(t.status),
				)}
				team={team}
				initialSprintName={newSprintName}
				redirectUrl={`/${workspace?.url}/team/${team?.identifier}/sprints`}
			/>
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
