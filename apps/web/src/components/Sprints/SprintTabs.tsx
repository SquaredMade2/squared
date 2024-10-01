import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { Sprint, Task } from "@repo/db";

interface SprintTabsProps {
	upcomingSprints: Sprint[];
	completedSprints: Sprint[];
	activeSprint: Sprint | null;
	tasks: Task[];
	calculateProgress: (sprint: Sprint) => number;
}

export function SprintTabs({
	upcomingSprints,
	completedSprints,
	activeSprint,
	tasks,
	calculateProgress,
}: SprintTabsProps) {
	const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
		"upcoming",
	);

	const renderSprintCard = (sprint: Sprint, isActive = false) => {
		const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
		const completedTasks = sprintTasks.filter((task) => task.status === "done");
		const carriedOverTasks = isActive
			? tasks.filter(
					(task) =>
						task.sprintId === sprint.id &&
						new Date(task.dateCreated) < new Date(sprint.startDate),
				)
			: [];
		const plannedTasks = sprintTasks.length;

		return (
			<Card
				key={sprint.id}
				className={`w-full mb-4 ${isActive ? "border-primary shadow-md" : ""}`}
			>
				<CardHeader className={isActive ? "bg-primary/5" : ""}>
					<CardTitle className={isActive ? "text-primary" : ""}>
						{sprint.name}
						{isActive && (
							<span className="ml-2 text-sm font-normal text-primary-foreground bg-primary rounded-full px-2 py-1">
								Active
							</span>
						)}
					</CardTitle>
					<CardDescription>
						{format(new Date(sprint.startDate), "PP")} -{" "}
						{format(new Date(sprint.endDate), "PP")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<Progress
							value={calculateProgress(sprint)}
							className={`w-full ${isActive ? "bg-primary/20" : ""}`}
						/>
						<p className="text-sm text-muted-foreground mt-2">
							{Math.round(calculateProgress(sprint))}% Complete
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<h4 className="font-semibold mb-1">Completed Tasks</h4>
							<p>{completedTasks.length}</p>
						</div>
						{isActive && (
							<div>
								<h4 className="font-semibold mb-1">Carried Over Tasks</h4>
								<p>{carriedOverTasks.length}</p>
							</div>
						)}
						{!isActive && (
							<div>
								<h4 className="font-semibold mb-1">Planned Tasks</h4>
								<p>{plannedTasks}</p>
							</div>
						)}
						<div>
							<h4 className="font-semibold mb-1">Total Tasks</h4>
							<p>{sprintTasks.length}</p>
						</div>
					</div>
					<div className="mt-4 flex justify-end">
						<Link href={`sprints/${sprint.id}`} passHref>
							<Button variant={isActive ? "default" : "outline"} size="sm">
								View Details <ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<Tabs
			defaultValue="upcoming"
			className="w-full"
			onValueChange={(value) => setActiveTab(value as "upcoming" | "completed")}
		>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="upcoming">Upcoming Sprints</TabsTrigger>
				<TabsTrigger value="completed">Completed Sprints</TabsTrigger>
			</TabsList>

			<ScrollArea className="h-full">
				<TabsContent
					value="upcoming"
					className={activeTab === "upcoming" ? "" : "hidden"}
				>
					{activeSprint && (
						<>
							<h3 className="text-lg font-semibold mb-2">Active Sprint</h3>
							{renderSprintCard(activeSprint, true)}
						</>
					)}
					<h3 className="text-lg font-semibold mb-2">Upcoming Sprints</h3>
					{upcomingSprints.map((sprint) => renderSprintCard(sprint))}
				</TabsContent>
				<TabsContent
					value="completed"
					className={activeTab === "completed" ? "" : "hidden"}
				>
					{completedSprints.map((sprint) => renderSprintCard(sprint))}
				</TabsContent>
			</ScrollArea>
		</Tabs>
	);
}
