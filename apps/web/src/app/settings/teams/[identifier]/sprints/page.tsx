"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	X,
	Maximize2,
	ChevronRight,
	CalendarIcon,
	ChevronDown,
} from "lucide-react";
import { addDays, format } from "date-fns";
import { useTeamStore } from "@/store";
import { cn } from "@/utils/cn";

export default function TeamSettingsSprints() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sprintsEnabled, setSprintsEnabled] = useState(false);
	const [isSprintInfoExpanded, setIsSprintInfoExpanded] = useState(true);
	const [sprintDuration, setSprintDuration] = useState(2);
	const [cooldownDuration, setCooldownDuration] = useState(1);
	const [sprintStartDate, setSprintStartDate] = useState<Date | undefined>(
		new Date(),
	);
	const [upcomingSprints, setUpcomingSprints] = useState(3);
	const [activeRequired, setActiveRequired] = useState(true);
	const [addStartedIssues, setAddStartedIssues] = useState(true);
	const [addCompletedIssues, setAddCompletedIssues] = useState(true);
	const { currentTeam, updateTeam } = useTeamStore((state) => state);

	useEffect(() => {
		if (currentTeam) {
			setSprintsEnabled(currentTeam.sprintsEnabled || false);
			setSprintDuration(currentTeam.sprintDuration || 2);
			setCooldownDuration(currentTeam.cooldownDuration || 1);
			setSprintStartDate(
				currentTeam.sprintStartDate
					? new Date(currentTeam.sprintStartDate)
					: new Date(),
			);
			setUpcomingSprints(currentTeam.upcomingSprints || 3);
			setActiveRequired(currentTeam.activeRequired || true);
			setAddStartedIssues(currentTeam.addStartedIssues || true);
			setAddCompletedIssues(currentTeam.addCompletedIssues || true);
			setIsLoading(false);
		}
	}, [currentTeam]);

	if (!currentTeam) return null;
	if (isLoading) return <div>Loading sprint settings...</div>;
	if (error) return <div>Error: {error}</div>;

	const handleSaveSettings = async () => {
		try {
			await updateTeam(currentTeam.id, {
				sprintsEnabled,
				sprintDuration,
				cooldownDuration,
				sprintStartDate,
				upcomingSprints,
				activeRequired,
				addStartedIssues,
				addCompletedIssues,
			});
		} catch {
			setError("Failed to save sprint settings");
		}
	};

	return (
		<div className="container mx-auto p-4 w-2/3 space-y-6">
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
					{!isSprintInfoExpanded && (
						<Button
							variant="link"
							className="p-0 h-auto mt-4"
							onClick={() => setIsSprintInfoExpanded(true)}
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
					checked={sprintsEnabled}
					onCheckedChange={setSprintsEnabled}
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
									onValueChange={(value) => setSprintDuration(Number(value))}
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
									onValueChange={(value) => setCooldownDuration(Number(value))}
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
														(next:{" "}
														{format(addDays(sprintStartDate, 7), "MMM dd")})
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
											selected={sprintStartDate}
											onSelect={setSprintStartDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex justify-between items-center w-full">
								<Label htmlFor="upcomingSprints">
									Number of upcoming sprints to create
								</Label>
								<Select
									value={upcomingSprints.toString()}
									onValueChange={(value) => setUpcomingSprints(Number(value))}
								>
									<SelectTrigger className="w-60 bg-secondary">
										<SelectValue placeholder="Select number" />
									</SelectTrigger>
									<SelectContent className="w-60">
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
											<SelectItem key={num} value={num.toString()}>
												{num} {num === 1 ? "sprint" : "sprints"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
					<p className="my-6 text-muted-foreground">
						To make sure all of your work is captured by sprints, Squared can
						automatically add issues that are started or completed to the
						current sprint.
					</p>
					<Card>
						<CardContent className="space-y-4 py-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex flex-col items-start">
										<Label htmlFor="addStartedIssues" className="mb-2">
											Add started issues
										</Label>
										<p className="text-sm text-muted-foreground w-11/12">
											Automatically include issues that team members have begun
											working on. This ensures your sprints accurately reflect
											ongoing work and helps maintain an up-to-date view of your
											team's progress.
										</p>
									</div>
									<Switch
										id="addStartedIssues"
										checked={addStartedIssues}
										onCheckedChange={setAddStartedIssues}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex flex-col items-start">
										<Label htmlFor="addCompletedIssues" className="mb-2">
											Add completed issues
										</Label>
										<p className="text-sm text-muted-foreground w-11/12">
											Incorporate recently completed issues into your sprints.
											This option provides a comprehensive overview of your
											team's accomplishments, making it easier to track
											productivity and celebrate successes during sprint
											reviews.
										</p>
									</div>
									<Switch
										id="addCompletedIssues"
										checked={addCompletedIssues}
										onCheckedChange={setAddCompletedIssues}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex items-center justify-between">
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
							onCheckedChange={setActiveRequired}
						/>
					</div>

					<Button onClick={handleSaveSettings} className="w-full mb-6">
						Save Sprint Settings
					</Button>
				</>
			)}
		</div>
	);
}
