"use client";

import type { Sprint, Status, Task } from "@squaredmade/db";
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
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
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
import { NewSprintModal } from "@/components/Sprints/NewSprintModal";
import { Progress } from "@/components/ui/progress";
import { useSprints } from "@/hooks/useSprints";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";

export default function SprintDashboardPage() {
	const { sprintId } = useParams();
	const router = useRouter();
	const { sprints, team, organization, loading, error, sprintTasks } =
		useSprints(parseParams(sprintId));
	const { tasks, setTasks } = useTaskStore((state) => state);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
	const [currentDay, setCurrentDay] = useState(0);
	const [burndownData, setBurndownData] = useState<
		{ day: number; tasks: number; ideal: number }[]
	>([]);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);
	const [showNextSprint, setShowNextSprint] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");
	const [newSprint, setNewSprint] = useState(false);
	const isSprintActive: boolean = sprint?.status === "ACTIVE";
	const isSprintCompleted: boolean = sprint?.status === "COMPLETED";

	useEffect(() => {
		const currentSprint = sprints.find((s: Sprint) => s.id === sprintId);
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
			(task: Task) => task.status === "done" || task.status === "canceled",
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
					(task: Task) =>
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
				ideal: totalTasks - (totalTasks / sprintDays) * i,
				tasks: Math.max(0, totalTasks - completedTasksCount),
			};
		});

		return data;
	}, [sprint, sprintTasks]);

	useEffect(() => {
		setCurrentDay(
			sprint ? differenceInDays(new Date(), new Date(sprint.startDate)) : 0,
		);
		setBurndownData(getBurndownData());
	}, [sprint]);

	const getTaskStatusData = () => {
		const statusCounts = sprintTasks.reduce(
			(acc: { [x: string]: number }, task: Task) => {
				acc[task.status] = (acc[task.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const statusColorMap: Record<Status, string> = {
			archived: "var(--color-gray-400)",
			backlog: "var(--color-gray-500)",
			canceled: "var(--color-red-500)",
			done: "var(--color-green-500)",
			duplicated: "var(--color-indigo-500)",
			inProgress: "var(--color-yellow-500)",
			inReview: "var(--color-purple-500)",
			todo: "var(--color-blue-500)",
		};

		return Object.entries(statusCounts).map(([status, count]) => ({
			color: statusColorMap[status as Status],
			name: formatStatus(status as Status),
			value: count,
		}));
	};

	const { mutate: handleBulkAssign } = useMutation({
		mutationFn: async () => {
			if (!sprint) throw new Error("Sprint not found");
			if (isSprintCompleted)
				throw new Error("Cannot add tasks to completed sprint");
			return await client.sprint.addSprintTasks
				.$post({
					sprintId: sprint.id,
					taskIds: selectedTasks.map((t) => t.id),
				})
				.then((res: Response) => res.json());
		},
		mutationKey: ["sprint", "sprintAssign", sprint?.id],
		onError: (e) => {
			toast.error("Failed to assign tasks to sprint", {
				description: e.message,
			});
		},
		onSuccess: (data) => {
			toast.success("Tasks assigned to sprint");
			setTasks(data);
		},
	});

	const { mutate: endSprint } = useMutation({
		mutationFn: async () => {
			if (!sprint) throw new Error("Sprint not found");
			if (!isSprintActive) throw new Error("Sprint is not active");
			return await client.sprint.endSprint
				.$post({
					sprintId: sprint.id,
				})
				.then((res: Response) => res.json());
		},
		mutationKey: ["sprint", "sprintEnd", sprint?.id],
		onError: (e) => {
			toast.error("Failed to end the sprint.", {
				description: e.message,
			});
		},
		onSuccess: () => {
			toast.success("Sprint ended successfully");
			router.push(`/${organization?.slug}/team/${team?.identifier}/all`);
		},
	});

	const handleEndSprintConfirm = () => {
		if (!(sprint && team)) return;
		setShowEndSprintDialog(false);
		if (newSprint) {
			setShowNextSprint(true);
		} else {
			endSprint();
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
				error={parseError(error, "Failed to fetch sprint data")}
				teamIdentifier={team?.identifier}
				workspaceUrl={organization?.slug ?? ""}
			/>
		);
	}
	if (!sprint) {
		return (
			<SprintNotFound
				teamIdentifier={team?.identifier}
				workspaceUrl={organization?.slug ?? ""}
			/>
		);
	}

	return (
		<div className="container mx-auto space-y-8 p-4">
			<h1 className="ml-10 font-bold text-3xl">Sprint: {sprint.name}</h1>
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
						<Progress className="w-full" value={calculateProgress()} />
						<p className="mt-2 text-muted-foreground text-sm">
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
								<h3 className="font-semibold text-lg">Total Tasks</h3>
								<p className="font-bold text-3xl">{sprintTasks.length}</p>
							</div>
							<div>
								<h3 className="font-semibold text-lg">Completed Tasks</h3>
								<p className="font-bold text-3xl">
									{
										sprintTasks.filter(
											(task: Task) =>
												task.status === "done" || task.status === "canceled",
										).length
									}
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-lg">In Progress</h3>
								<p className="font-bold text-3xl">
									{
										sprintTasks.filter(
											(task: Task) =>
												task.status === "inProgress" ||
												task.status === "inReview",
										).length
									}
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-lg">To Do</h3>
								<p className="font-bold text-3xl">
									{
										sprintTasks.filter((task: Task) => task.status === "todo")
											.length
									}
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
						<ResponsiveContainer height="100%" width="100%">
							<LineChart
								data={burndownData}
								margin={{ bottom: 5, left: 20, right: 20, top: 15 }}
							>
								<XAxis axisLine={false} dataKey="day" tick={false} />
								<YAxis hide />
								<Tooltip
									contentStyle={{
										background: "var(--card)",
										border: "none",
										borderRadius: "8px",
									}}
									formatter={(value) => Math.floor(Number(value))}
									labelStyle={{ color: "var(--muted-foreground)" }}
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
									stroke="var(--muted)"
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
						<CardTitle>Task Status Distribution</CardTitle>
					</CardHeader>
					<CardContent className="h-[300px]">
						<ResponsiveContainer height="100%" width="100%">
							<PieChart>
								<Pie
									cx="50%"
									cy="50%"
									data={getTaskStatusData()}
									dataKey="value"
									fill="#8884d8"
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									labelLine={false}
									outerRadius={80}
								>
									{getTaskStatusData().map((entry) => (
										<Cell
											fill={entry.color}
											key={`cell-${entry.name}-${entry.value}`}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
			{isSprintActive && (
				<div className="flex items-center justify-between space-x-4">
					<Button
						className="flex-1 border-destructive"
						onClick={() => handleButtonClick(false)}
						variant="outline"
					>
						End Sprint
					</Button>
					<Link
						className="flex-1"
						href={`/${organization?.slug}/team/${team?.identifier}/sprints/${sprintId}/retrospective`}
						passHref
					>
						<Button className="w-full">Start Sprint Retrospective</Button>
					</Link>
					<Button className="flex-1" onClick={() => handleButtonClick(true)}>
						Start Next Sprint
					</Button>
				</div>
			)}
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-2xl">Sprint Tasks</h2>
				{!isSprintCompleted && (
					<div className="space-x-4">
						<AssignTasksDialog
							activeSprint={sprint}
							handleBulkAssign={() => handleBulkAssign()}
							selectedTasks={selectedTasks}
							setSelectedTasks={setSelectedTasks}
							unassignedTasks={unassignedTasks}
							upcomingSprints={[]}
						/>
					</div>
				)}
			</div>
			<Tabs className="w-full" defaultValue="all">
				<TabsList className="w-full">
					<TabsTrigger className="flex-1" value="all">
						All Tasks
					</TabsTrigger>
					<TabsTrigger className="flex-1" value="todo">
						To Do
					</TabsTrigger>
					<TabsTrigger className="flex-1" value="inProgress">
						In Progress
					</TabsTrigger>
					<TabsTrigger className="flex-1" value="done">
						Done
					</TabsTrigger>
				</TabsList>
				<div className="scrollbar-thumb-[var(--border)] scrollbar-thumb-rounded-lg scrollbar-thin scrollbar-track-transparent h-[45rem] overflow-y-scroll">
					<TabsContent value="all">
						<TaskList tasks={sprintTasks} />
					</TabsContent>
					<TabsContent value="todo">
						<TaskList
							tasks={sprintTasks.filter((task: Task) => task.status === "todo")}
						/>
					</TabsContent>
					<TabsContent value="inProgress">
						<TaskList
							tasks={sprintTasks.filter(
								(task: Task) =>
									task.status === "inProgress" || task.status === "inReview",
							)}
						/>
					</TabsContent>
					<TabsContent value="done">
						<TaskList
							tasks={sprintTasks.filter(
								(task: Task) =>
									task.status === "done" || task.status === "canceled",
							)}
						/>
					</TabsContent>
				</div>
			</Tabs>

			<Dialog onOpenChange={setShowEndSprintDialog} open={showEndSprintDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>End Sprint</DialogTitle>
						<DialogDescription>
							Are you sure you want to end this sprint?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose>Cancel</DialogClose>
						<Button className="mb-3 sm:mb-0" onClick={handleEndSprintConfirm}>
							End Sprint
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<NewSprintModal
				initialSprintName={newSprintName}
				isOpen={showNextSprint}
				onClose={() => setShowNextSprint(false)}
				redirectUrl={`/${organization?.slug}/team/${team?.identifier}/sprints`}
				team={team || null}
			/>
		</div>
	);
}

function TaskList({ tasks }: { tasks: Task[] }) {
	return (
		<div>
			{tasks.length > 0 ? (
				<div className="space-y-2">
					{tasks.map((task) => (
						<Card key={task.id}>
							<CardHeader>
								<CardTitle>{task.title}</CardTitle>
								<CardDescription className="w-fit rounded-lg border-2 px-2 py-1">
									Status: {formatStatus(task.status)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{task.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="space-y-2">
					<Card className="text-center text-muted-foreground">
						<CardHeader>
							<CardTitle>No tasks</CardTitle>
						</CardHeader>
						<CardContent>
							<p>There are no tasks within this category for this sprint.</p>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
