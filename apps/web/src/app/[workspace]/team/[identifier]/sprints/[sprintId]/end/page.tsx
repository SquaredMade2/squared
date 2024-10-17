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
import type { Sprint } from "@repo/db";
import { TransferTaskModal } from "@/components/Sprints/TransferTaskModal";

export default function EndSprintPage() {
	const router = useRouter();
	const { sprintId } = useParams();
	const { sprints, team, workspace, loading, error, sprintTasks } =
		useSprints();
	const { tasks, getAllTasks } = useTaskStore((state) => state);
	const { nextSprint, endSprint } = useTeamStore((state) => state);
	const [sprint, setSprint] = useState<Sprint | null>(null);
	const [showEndSprintDialog, setShowEndSprintDialog] = useState(false);
	const [showTaskSelectionModal, setShowTaskSelectionModal] = useState(false);
	const [newSprintName, setNewSprintName] = useState("");

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
			setNewSprintName(`Sprint ${sprints.length + 1}`);
		}
	}, [sprints, tasks, sprintId]);

	const handleEndSprint = () => {
		setShowEndSprintDialog(true);
	};

	const handleEndSprintConfirm = async (startNewSprint: boolean) => {
		if (!sprint || !team) return;

		try {
			const response = await endSprint(team.id, sprint.id);

			if (response.variant === "destructive") {
				throw new Error(response.message);
			}

			if (startNewSprint) {
				setShowTaskSelectionModal(true);
			} else {
				toast({
					title: "Sprint ended successfully",
					description: "No new sprint was started.",
				});
				router.push(`/${workspace?.url}/team/${team?.identifier}/all`);
			}
		} catch (error) {
			console.error("Error ending sprint:", error);
			toast({
				title: "Error",
				description: "Failed to end the sprint. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleNextSprintConfirm = async (
		selectedTasks: string[],
		sprintName: string,
	) => {
		if (!team) return;

		try {
			const response = await nextSprint(team.id, selectedTasks, {
				name: sprintName,
			});

			if (response.variant === "destructive") {
				throw new Error(response.message);
			}

			toast({
				title: "New sprint started successfully",
				description: `${selectedTasks.length} tasks moved to the new sprint.`,
			});
			router.push(`/${workspace?.url}/team/${team?.identifier}/sprints`);
		} catch (error) {
			console.error("Error starting next sprint:", error);
			toast({
				title: "Failed to start the next sprint.",
				description:
					error instanceof Error ? error.message : "Please try again.",
				variant: "destructive",
			});
		}
	};

	const movableTasks = sprintTasks.filter((task) =>
		["backlog", "todo", "inProgress", "inReview"].includes(task.status),
	);

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
						<Button onClick={handleEndSprint} className="w-full">
							End Sprint
						</Button>
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
							Do you want to start a new sprint immediately after ending this
							one?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleEndSprintConfirm(false)}>
							End Sprint Only
						</AlertDialogAction>
						<AlertDialogAction onClick={() => handleEndSprintConfirm(true)}>
							End Sprint and Start New
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<TransferTaskModal
				isOpen={showTaskSelectionModal}
				onClose={() => setShowTaskSelectionModal(false)}
				tasks={movableTasks}
				onConfirm={handleNextSprintConfirm}
				initialSprintName={newSprintName}
			/>
		</div>
	);
}
