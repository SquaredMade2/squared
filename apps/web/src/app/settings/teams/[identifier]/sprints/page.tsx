"use client";

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
import { useToast } from "@/components/ui/use-toast";
import { useTeams } from "@/hooks/useTeams";
import { sprintService } from "@/lib/services";
import { useTaskStore, useTeamStore } from "@/store";
import { cn } from "@/utils/cn";
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
import { useEffect, useState } from "react";

export default function TeamSettingsSprints() {
	const { updateTeam, setCurrentTeam } = useTeamStore((state) => state);
	const { currentTeam, loading: teamLoading } = useTeams();
	const { toggleSprintTasks } = useTaskStore((state) => state);
	const [isSprintInfoExpanded, setIsSprintInfoExpanded] = useState(false);
	const [sprintStartDate, setSprintStartDate] = useState<Date | null>(
		currentTeam?.sprintStartDate || null,
	);
	const [pendingSprints, setPendingSprints] = useState(0);
	const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		if (currentTeam) {
			sprintService
				.getSprints(TODO, { teamId: currentTeam.id })
				.then((sprints) => {
					const pending = sprints.filter((s) => s.status === "PLANNED").length;
					setPendingSprints(pending);
					const active = sprints.find((s) => s.status === "ACTIVE");
					setActiveSprint(active || null);
				});
		}
	}, [currentTeam, sprintService]);

	const handleUpdateTeam = async (data: Partial<Team>) => {
		try {
			if (!currentTeam) throw new Error("No team found");
			const response = await updateTeam(currentTeam.id, data);
			if (response.team?.sprintsEnabled) {
				const newSprintCount = await sprintService.initializeSprints(TODO, {
					teamId: currentTeam.id,
				});
				setPendingSprints(newSprintCount);
			}
			if (!response) return;
			response.variant === "destructive"
				? toast(response)
				: response.team && setCurrentTeam(response.team);
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

	const handleAddTasksToSprint = async (type: "active" | "completed") => {
		if (!currentTeam || !activeSprint) return;

		try {
			const response = await toggleSprintTasks(
				currentTeam.id,
				activeSprint.id,
				"add",
			);

			if (response.data) {
				toast({
					title: `${type === "active" ? "Active" : "Completed"} tasks added to sprint`,
					description:
						"The tasks have been successfully added to the current sprint.",
					variant: "default",
				});
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			toast({
				title: `Error adding ${type} tasks to sprint`,
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
				variant: "destructive",
			});
		}
	};

	if (teamLoading)
		return (
			<div className="container mx-auto p-4 w-2/3 space-y-6 mb-16">
				<h1 className="text-3xl font-bold mb-2">Sprints</h1>
				<p className="text-muted-foreground mb-6">
					Organize your team's work into time-boxed iterations
				</p>
				<div className="flex justify-center items-center w-full h-64">
					<SquaredLoader />
				</div>
			</div>
		);
	if (!currentTeam) return null;
	const {
		sprintsEnabled,
		sprintDuration,
		cooldownDuration,
		upcomingSprints,
		activeRequired,
	} = currentTeam;

	return (
		<div className="container mx-auto p-4 w-2/3 space-y-6 mb-16">
			<h1 className="text-3xl font-bold mb-2">Sprints</h1>
			<p className="text-muted-foreground mb-6">
				Organize your team's work into time-boxed iterations
			</p>

			<Card className="mb-6">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-2xl font-bold">
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
						<Button
							variant="link"
							className="p-0 h-auto mt-4"
							// TODO: ADD CORRESPONDING LINK ON WWW APPLICATION
							onClick={() =>
								toast({
									title: "Just pretend you've been taken to the docs page 🤫",
								})
							}
						>
							Read more <ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					)}
				</CardContent>
			</Card>

			<Separator className="my-6" />

			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-semibold mb-2">Enable Sprints</h2>
					<p className="text-muted-foreground">
						Turn on sprint functionality for your team
					</p>
				</div>
				<Switch
					checked={currentTeam.sprintsEnabled}
					onCheckedChange={(checked) =>
						handleUpdateTeam({
							sprintsEnabled: checked,
							sprintDuration: 2,
							cooldownDuration: 1,
							sprintStartDate: addDays(
								startOfWeek(new Date(), { weekStartsOn: 1 }),
								7,
							),
							upcomingSprints: 3,
							activeRequired: true,
						})
					}
					aria-label="Enable sprints"
				/>
			</div>

			{sprintsEnabled && (
				<>
					<Card className="py-6">
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center w-full">
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
							<div className="flex justify-between items-center w-full">
								<Label htmlFor="cooldownDuration">
									Cooldown after each sprint (days)
								</Label>
								<Select
									value={cooldownDuration.toString()}
									onValueChange={(value) =>
										handleUpdateTeam({ cooldownDuration: Number(value) })
									}
								>
									<SelectTrigger className="w-60 bg-secondary">
										<SelectValue placeholder="Select cooldown" />
									</SelectTrigger>
									<SelectContent className="w-60">
										{[0, 1, 2, 3, 4, 5, 6, 7].map((days) => (
											<SelectItem key={days} value={days.toString()}>
												{days} {days === 1 ? "day" : "days"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex justify-between items-start w-full">
								<Label htmlFor="sprintStartDate" className="mt-4">
									Sprints start on
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"secondary"}
											className={cn(
												"w-60 justify-start text-left font-normal pr-3",
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
											<ChevronDown className="ml-auto mr-0 text-muted-foreground h-4 w-4" />
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
							<div className="flex justify-between items-center w-full">
								<Label htmlFor="upcomingSprints">
									Number of upcoming sprints to create (max 3 pending)
								</Label>
								<Select
									value={upcomingSprints.toString()}
									onValueChange={(value) =>
										handleUpdateTeam({ upcomingSprints: Number(value) })
									}
								>
									<SelectTrigger className="w-60 bg-secondary">
										<SelectValue placeholder="Select number" />
									</SelectTrigger>
									<SelectContent className="w-60">
										{[1, 2, 3].map((num) => (
											<SelectItem key={num} value={num.toString()}>
												{num} {num === 1 ? "sprint" : "sprints"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<p className="text-sm text-muted-foreground">
								Current pending sprints: {pendingSprints}
							</p>
						</CardContent>
					</Card>
					<p className="my-6 text-muted-foreground">
						You can add unassigned tasks to the current active sprint using the
						buttons below.
					</p>
					<Card>
						<CardContent className="space-y-4 py-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex flex-col items-start">
										<Label htmlFor="addActiveTasks" className="mb-2">
											Add active tasks to current sprint
										</Label>
										<p className="text-sm text-muted-foreground w-11/12">
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
													This will add all unassigned active tasks to the
													current sprint. Are you sure you want to continue?
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleAddTasksToSprint("active")}
												>
													Continue
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex flex-col items-start">
										<Label htmlFor="addCompletedTasks" className="mb-2">
											Add completed tasks to current sprint
										</Label>
										<p className="text-sm text-muted-foreground w-11/12">
											Add all unassigned completed tasks (Done) to the current
											sprint.
										</p>
									</div>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="outline">Add Completed Tasks</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Add Completed Tasks to Sprint
												</AlertDialogTitle>
												<AlertDialogDescription>
													This will add all unassigned completed tasks to the
													current sprint. Are you sure you want to continue?
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleAddTasksToSprint("completed")}
												>
													Continue
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex items-center justify-between mt-6">
						<div className="flex flex-col items-start">
							<Label htmlFor="activeRequired" className="mb-2">
								Active issues are required to belong to a sprint.
							</Label>
							<p className="text-sm text-muted-foreground">
								Boost focus and accountability by ensuring all active work is
								sprint-aligned
							</p>
						</div>
						<Switch
							id="activeRequired"
							checked={activeRequired}
							onCheckedChange={(checked) =>
								handleUpdateTeam({ activeRequired: checked })
							}
						/>
					</div>
				</>
			)}
		</div>
	);
}
