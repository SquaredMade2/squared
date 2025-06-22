import type { Sprint, Task } from "@squaredmade/db";
import { ChevronRight } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@squaredmade/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
	const completedTasks = sprintTasks.filter(
		(task) => task.status === "done" || task.status === "canceled",
	);
	const carriedOverTasks = isActive
		? tasks.filter(
				(task) =>
					task.sprintId === sprint.id &&
					new Date(task.dateCreated) < new Date(sprint.startDate),
			)
		: [];
	const plannedTasks = sprintTasks.length;

	const calculateProgress = (s: Sprint) => {
		const st = tasks.filter((task) => task.sprintId === s.id);
		const ct = st.filter((task) => task.status === "done");

		if (st.length === 0) return 0; // Avoid division by zero

		const progress = (ct.length / st.length) * 100;
		return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
	};

	return (
		<Card
			className={`mb-4 w-full ${isActive ? "border-primary shadow-md" : ""}`}
			key={sprint.id}
		>
			<CardHeader className={isActive ? "bg-primary/5" : ""}>
				<CardTitle className={isActive ? "text-primary" : ""}>
					{sprint.name}
					{isActive && (
						<span className="ml-2 rounded-full bg-primary px-2 py-1 font-normal text-primary-foreground text-sm">
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
						className={`w-full ${isActive ? "bg-primary/20" : ""}`}
						value={calculateProgress(sprint)}
					/>
					<p className="mt-2 text-muted-foreground text-sm">
						{Math.round(calculateProgress(sprint))}% Complete
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<h4 className="mb-1 font-semibold">Completed Tasks</h4>
						<p>{completedTasks.length}</p>
					</div>
					{isActive && (
						<div>
							<h4 className="mb-1 font-semibold">Carried Over Tasks</h4>
							<p>{carriedOverTasks.length}</p>
						</div>
					)}
					{!isActive && (
						<div>
							<h4 className="mb-1 font-semibold">Planned Tasks</h4>
							<p>{plannedTasks}</p>
						</div>
					)}
					<div>
						<h4 className="mb-1 font-semibold">Total Tasks</h4>
						<p>{sprintTasks.length}</p>
					</div>
				</div>
				<div className="mt-4 flex justify-end">
					<Link href={`sprints/${sprint.id}`}>
						<Button size="sm" variant={isActive ? "default" : "outline"}>
							View Details <ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};
