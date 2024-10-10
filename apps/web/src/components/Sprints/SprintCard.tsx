import type { Sprint, Task } from "@repo/db";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import Link from "next/link";

interface SprintCardProps {
	sprint: Sprint;
	tasks: Task[];
	isActive?: boolean;
}

export const SprintCard = ({
	sprint,
	tasks,
	isActive = false,
}: SprintCardProps) => {
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

	const calculateProgress = (sprint: Sprint) => {
		const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
		const completedTasks = sprintTasks.filter((task) => task.status === "done");

		if (sprintTasks.length === 0) return 0; // Avoid division by zero

		const progress = (completedTasks.length / sprintTasks.length) * 100;
		return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
	};

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
					<Link href={`sprints/${sprint.id}`}>
						<Button variant={isActive ? "default" : "outline"} size="sm">
							View Details <ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};
