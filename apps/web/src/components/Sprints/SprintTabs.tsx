import type { Sprint, Task } from "@squaredmade/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
			className="w-full"
			defaultValue="upcoming"
			onValueChange={(value) => setActiveTab(value as "upcoming" | "completed")}
		>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="upcoming">Upcoming Sprints</TabsTrigger>
				<TabsTrigger value="completed">Completed Sprints</TabsTrigger>
			</TabsList>

			<ScrollArea className="h-full">
				<TabsContent
					className={activeTab === "upcoming" ? "" : "hidden"}
					value="upcoming"
				>
					{activeSprint && (
						<>
							<h3 className="mb-2 font-semibold text-lg">Active Sprint</h3>
							<SprintCard isActive sprint={activeSprint} tasks={tasks} />
						</>
					)}
					{upcomingSprints.length > 0 && (
						<h3 className="mb-2 font-semibold text-lg">Upcoming Sprints</h3>
					)}
					{upcomingSprints.map((sprint) => (
						<SprintCard key={sprint.id} sprint={sprint} tasks={tasks} />
					))}
				</TabsContent>
				<TabsContent
					className={activeTab === "completed" ? "" : "hidden"}
					value="completed"
				>
					{completedSprints.map((sprint) => (
						<SprintCard key={sprint.id} sprint={sprint} tasks={tasks} />
					))}
				</TabsContent>
			</ScrollArea>
		</Tabs>
	);
}
