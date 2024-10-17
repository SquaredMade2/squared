"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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
import type { Task, Sprint } from "@repo/db";
import { TransferTaskModal } from "@/components/Sprints/TransferTaskModal";
import { parseParams } from "@/utils/parseParams";

export default function EndSprintPage() {
	const router = useRouter();
	const { sprintId } = useParams();
	const { sprints, team, workspace, loading, error, sprintTasks } =
		useSprints();
	const { getAllTasks } = useTaskStore((state) => state);
	const { nextSprint, endSprint, getSprintTasks } = useTeamStore(
		(state) => state,
	);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);
	const [showTaskSelectionModal, setShowTaskSelectionModal] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");
	const [newSprint, setNewSprint] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
	const [sprintName, setSprintName] = useState("");

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
				console.log("tasks", tasks);
				setTasks(tasks);
			};
			loadSprintTasks();
			setNewSprintName(`Sprint ${sprints.length + 1}`);
		}
	}, [sprints, sprintId]);

	const handleEndSprintConfirm = async () => {
		if (!sprint || !team) return;

		try {
			if (newSprint) {
				setShowTaskSelectionModal(true);
				const response = await nextSprint(team.id, selectedTasks, {
					name: sprintName,
				});

				toast(response);
				router.push(`/${workspace?.url}/team/${team?.identifier}/sprints`);
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
			<h1 className="text-3xl font-bold">End Sprint</h1>
			<Card>
				<CardHeader>
					<CardTitle>{sprint.name}</CardTitle>
					<CardDescription>
						{format(new Date(sprint.startDate), "PP")} -{" "}
						{format(new Date(sprint.endDate), "PP")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h2 className="text-xl font-semibold">Sprint Summary</h2>
							<p>Total Tasks: {sprintTasks.length}</p>
							<p>
								Completed Tasks:{" "}
								{
									sprintTasks.filter(
										(task) =>
											task.status === "done" || task.status === "canceled",
									).length
								}
							</p>
							<p>
								Incomplete Tasks:{" "}
								{
									sprintTasks.filter(
										(task) =>
											task.status !== "done" && task.status !== "canceled",
									).length
								}
							</p>
						</div>
						<div className="w-full gap-2 grid grid-cols-3">
							<Button variant="outline">Cancel</Button>
							<Button
								onClick={() => handleButtonClick(false)}
								variant="outline"
								className="border-destructive"
							>
								End Sprint
							</Button>
							<Button onClick={() => handleButtonClick(true)}>
								Start Next Sprint
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

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
				setSelectedTasks={setSelectedTasks}
				setSprintName={setSprintName}
				initialSprintName={newSprintName}
			/>
		</div>
	);
}
