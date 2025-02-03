"use client";

import { useToast } from "@/components/ui/use-toast";
import { useTeams } from "@/hooks/useTeams";
import { sprintService, taskService, teamService } from "@/lib/services";
import { useTeamStore } from "@/store";
import { TODO } from "@squared/context";
import type { Sprint, Team } from "@squared/db";
import { addDays, format, startOfWeek } from "date-fns";
import {
	CalendarIcon,
	ChevronDown,
	ChevronRight,
	Maximize2,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/cn";

export default function SprintSettings() {
	const { updateTeam, setTeam } = useTeamStore((state) => state);
	const { team, loading: teamLoading } = useTeams();
	const [isSprintInfoExpanded, setIsSprintInfoExpanded] = useState(false);
	const [sprintEnabled, setSprintEnabled] = useState(
		team?.sprintsEnabled || false,
	);
	const [sprintStartDate, setSprintStartDate] = useState<Date | null>(
		team?.sprintStartDate || null,
	);
	const [pendingSprints, setPendingSprints] = useState(0);
	const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		if (team) {
			sprintService.getSprints(TODO, { teamId: team.id }).then((sprints) => {
				const pending = sprints.filter((s) => s.status === "PLANNED").length;
				setPendingSprints(pending);
				const active = sprints.find((s) => s.status === "ACTIVE");
				setActiveSprint(active || null);
			});
		}
	}, [team, sprintService]);

	const handleUpdateTeam = async (
		data: Partial<
			Pick<
				Team,
				| "sprintsEnabled"
				| "sprintDuration"
				| "cooldownDuration"
				| "sprintStartDate"
			>
		>,
	) => {
		try {
			if (!team) throw new Error("No team found");
			console.log("Type of Start Date: ", data.sprintStartDate instanceof Date);
			const updatedTeam = await teamService.updateTeamSprints(TODO, {
				id: team.id,
				...data,
			});
			setTeam(updatedTeam);
			updateTeam(updatedTeam);
			setSprintEnabled(updatedTeam.sprintsEnabled);
			if (updatedTeam.sprintsEnabled) {
				const newSprintCount = await sprintService.initializeSprints(TODO, {
					teamId: team.id,
				});
				setPendingSprints(newSprintCount);
			}
			if (!updatedTeam) return;
			toast({ title: "Team updated successfully" });
		} catch (error) {
			error instanceof Error
				? toast({
						title: `Error updating team sprints: ${error.message}`,
						variant: "destructive",
					})
				: toast({
						title: "Error updating team sprints",
						variant: "destructive",
					});
		}
	};

	const handleAddTasksToSprint = async () => {
		if (!team || !activeSprint) return;

		try {
			const response = await taskService.addActiveSprintTasks(TODO, {
				sprintId: activeSprint.id,
			});

			if (response) {
				toast({
					title: "Active tasks added to sprint",
					description:
						"The tasks have been successfully added to the current sprint.",
					variant: "default",
				});
			}
		} catch (error) {
			toast({
				title: "Error adding active tasks to sprint",
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
				variant: "destructive",
			});
		}
	};

	if (teamLoading)
		return (
			<div className="container mx-auto mb-16 w-2/3 space-y-6 p-4">
				<h1 className="mb-2 font-bold text-3xl">Sprints</h1>
				<p className="mb-6 text-muted-foreground">
					Organize your team's work into time-boxed iterations
				</p>
				<div className="flex h-64 w-full items-center justify-center">
					<SquaredLoader />
				</div>
			</div>
		);
	if (!team) return null;
	const { sprintDuration } = team;

	return (
		<div className="container mx-auto mb-16 w-2/3 space-y-6 p-4">
			<h1 className="mb-2 font-bold text-3xl">Sprints</h1>
			<p className="mb-6 text-muted-foreground">
				Organize your team's work into time-boxed iterations
			</p>

			<Card className="mb-6">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-bold text-2xl">
						What is a Sprint?
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsSprintInfoExpanded(!isSprintInfoExpanded)}
						aria-label={
							isSprintInfoExpanded
								? "Minimize sprint info"
								: "Expand sprint info"
						}
					>
						{isSprintInfoExpanded ? (
							<X className="h-4 w-4" />
						) : (
							<Maximize2 className="h-4 w-4" />
						)}
					</Button>
				</CardHeader>
				<CardContent>
					{isSprintInfoExpanded ? (
						<>
							<p className="mb-2">
								A sprint is a short, time-boxed period when a team works to
								complete a set amount of work. Sprints are at the very heart of
								scrum and agile methodologies, and getting sprints right will
								help your agile team ship better software with fewer headaches.
							</p>
							<p>
								Sprints help teams follow the agile principle of "delivering
								working software frequently," as well as live the agile value of
								"responding to change over following a plan." The scrum
								framework enables your team to ship better software through an
								iterative and incremental approach.
							</p>
						</>
					) : (
						<p>
							A sprint is a short, time-boxed period when a team works to
							complete a set amount of work.
						</p>
					)}
					{isSprintInfoExpanded && (
						<Link href="www.squaredmade.com/docs/sprints" passHref>
							<Button variant="link" className="mt-4 h-auto p-0">
								Read more <ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					)}
				</CardContent>
			</Card>

			<Separator className="my-6" />

			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="mb-2 font-semibold text-lg">Enable Sprints</h2>
					<p className="text-muted-foreground">
						Turn on sprint functionality for your team
					</p>
				</div>
				<Switch
					checked={sprintEnabled}
					onCheckedChange={(checked) =>
						handleUpdateTeam({
							sprintsEnabled: checked,
							sprintDuration: 2,
							cooldownDuration: 1,
							sprintStartDate: addDays(
								startOfWeek(new Date(), { weekStartsOn: 1 }),
								7,
							),
						})
					}
					aria-label="Enable sprints"
				/>
			</div>

			{sprintEnabled && (
				<>
					<Card className="py-6">
						<CardContent className="space-y-4">
							<div className="flex w-full items-center justify-between">
								<Label htmlFor="sprintDuration">
									Each sprint lasts (weeks)
								</Label>
								<Select
									value={sprintDuration.toString()}
									onValueChange={(value) =>
										handleUpdateTeam({ sprintDuration: Number(value) })
									}
								>
									<SelectTrigger className="w-60 bg-secondary">
										<SelectValue placeholder="Select duration" />
									</SelectTrigger>
									<SelectContent className="w-60">
										{[1, 2, 3, 4, 5, 6, 7, 8].map((weeks) => (
											<SelectItem key={weeks} value={weeks.toString()}>
												{weeks} {weeks === 1 ? "week" : "weeks"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex w-full items-start justify-between">
								<Label htmlFor="sprintStartDate" className="mt-4">
									Sprints start on
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"secondary"}
											className={cn(
												"w-60 justify-start pr-3 text-left font-normal",
												!sprintStartDate && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{sprintStartDate ? (
												<>
													{format(sprintStartDate, "EEEE")}{" "}
													<span className="ml-2">
														(next: {format(sprintStartDate, "MMM dd")})
													</span>
												</>
											) : (
												<span>Pick a date</span>
											)}
											<ChevronDown className="mr-0 ml-auto h-4 w-4 text-muted-foreground" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={sprintStartDate ?? undefined}
											onSelect={(value) => {
												setSprintStartDate(value ?? null);
												handleUpdateTeam({ sprintStartDate: value });
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<p className="text-muted-foreground text-sm">
								Current pending sprints: {pendingSprints}
							</p>
						</CardContent>
					</Card>

					<Card className="mt-6">
						<CardContent className="space-y-4 py-6">
							<div className="flex items-center justify-between">
								<div className="flex flex-col items-start">
									<Label htmlFor="addActiveTasks" className="mb-2">
										Add active tasks to current sprint
									</Label>
									<p className="w-11/12 text-muted-foreground text-sm">
										Add all unassigned active tasks (To Do, In Progress, In
										Review) to the current sprint.
									</p>
								</div>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="outline">Add Active Tasks</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Add Active Tasks to Sprint
											</AlertDialogTitle>
											<AlertDialogDescription>
												This will add all unassigned active tasks to the current
												sprint. Are you sure you want to continue?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={handleAddTasksToSprint}>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
