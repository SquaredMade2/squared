import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Sprint, Task } from "@repo/db";
import { SprintCard } from "./SprintCard";

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
}: SprintTabsProps) {
	const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
		"upcoming",
	);

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
							<SprintCard sprint={activeSprint} tasks={tasks} isActive />
						</>
					)}
					<h3 className="text-lg font-semibold mb-2">Upcoming Sprints</h3>
					{upcomingSprints.map((sprint) => (
						<SprintCard sprint={sprint} tasks={tasks} key={sprint.id} />
					))}
				</TabsContent>
				<TabsContent
					value="completed"
					className={activeTab === "completed" ? "" : "hidden"}
				>
					{completedSprints.map((sprint) => (
						<SprintCard sprint={sprint} tasks={tasks} key={sprint.id} />
					))}
				</TabsContent>
			</ScrollArea>
		</Tabs>
	);
}
