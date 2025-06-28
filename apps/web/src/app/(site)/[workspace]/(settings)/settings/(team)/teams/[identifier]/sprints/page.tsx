"use client";

import type { Team } from "@squaredmade/db";
import {
	Calendar as CalendarIcon,
	ChevronDown,
	ChevronRight,
	Maximize2,
	X,
} from "@squaredmade/icons";
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
} from "@squaredmade/ui/alert-dialog";
import { Button } from "@squaredmade/ui/button";
import { Calendar } from "@squaredmade/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import { cn } from "@squaredmade/ui/cn";
import { Label } from "@squaredmade/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { Separator } from "@squaredmade/ui/separator";
import { Switch } from "@squaredmade/ui/switch";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addDays, format, startOfWeek } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import SettingsSprintCard from "@/components/Sprints/Settings/SettingsSprintCard";
import { useTeams } from "@/hooks/useTeams";
import { client } from "@/lib/client";
import { useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";

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

	const {
		data: { pending, active, allSprints } = {
			pending: 0,
			active: null,
			allSprints: null,
		},
		refetch: refetchSprints,
	} = useQuery({
		queryKey: ["sprint", team?.id],
		queryFn: async () => {
			if (!team) return { pending: 0, active: null, allSprints: null };
			const sprints = await client.sprint.getSprints
				.$get({ teamId: team.id })
				.then((res) => res.json());

			return {
				pending: sprints.filter((s) => s.status === "PLANNED").length,
				allSprints: sprints.filter(
					(s) => s.status === "ACTIVE" || s.status === "PLANNED",
				),
				active: sprints.find((s) => s.status === "ACTIVE"),
			};
		},
	});

	const { mutate: handleUpdateTeam } = useMutation({
		mutationKey: ["team", "updateTeam", team?.id],
		mutationFn: async (
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
			if (!team) throw new Error("No team found");
			const updatedTeam = await client.sprint.updateTeamSprints
				.$post({ teamId: team.id, data })
				.then((res) => res.json());
			if (updatedTeam.sprintsEnabled) {
				await client.sprint.initializeSprints
					.$post({
						teamId: updatedTeam.id,
					})
					.then((res) => res.json());
			}
			return updatedTeam;
		},
		onSuccess: async (updatedTeam) => {
			if (!updatedTeam) return;
			setTeam(updatedTeam);
			updateTeam(updatedTeam);
			setSprintEnabled(updatedTeam.sprintsEnabled);
			refetchSprints();
		},
		onError: (error) => {
			toast.error("Error updating team sprints", {
				description: parseError(error),
			});
		},
	});

	const { mutate: handleAddTasksToSprint } = useMutation({
		mutationKey: ["sprint", "addActiveSprintTasks"],
		mutationFn: async () => {
			if (!active) throw new Error("No active sprint found");
			return await client.sprint.addActiveTasks
				.$post({ sprintId: active.id })
				.then((res) => res.json());
		},
		onSuccess: async () => {
			toast.success("Active tasks added to sprint", {
				description:
					"The tasks have been successfully added to the current sprint.",
			});
		},
		onError: (error) => {
			toast.error("Error adding active tasks to sprint", {
				description: parseError(error),
			});
		},
	});

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
								Current pending sprints: {pending}
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
											<AlertDialogAction
												onClick={() => handleAddTasksToSprint()}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardContent>
					</Card>

					<Separator className="my-6" />

					<div>
						<h2 className="mb-2 font-semibold text-lg">Current Sprints</h2>
						<p className="text-muted-foreground">
							Manage your team's current sprints.
						</p>
					</div>
					{allSprints?.length &&
						allSprints.map((sprint) => (
							<SettingsSprintCard
								key={sprint.id}
								team={team}
								sprint={sprint}
								isActive={sprint.status === "ACTIVE"}
							/>
						))}
				</>
			)}
		</div>
	);
}
