"use client";

import { SprintError, SprintLoading } from "@/components/Sprints";
import { SprintCard } from "@/components/Sprints/SprintCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSprints } from "@/hooks/useSprints";
import { useTaskStore } from "@/store";

export default function UpcomingSprints() {
	const { workspace, team, sprints, loading, error } = useSprints();
	const { tasks } = useTaskStore((state) => state);

	if (loading) {
		return <SprintLoading />;
	}

	if (error) {
		return (
			<SprintError
				error={error}
				teamIdentifier={team?.identifier}
				workspaceUrl={workspace?.url}
			/>
		);
	}

	const upcomingSprints = sprints.filter(
		(sprint) => sprint.status === "PLANNED",
	);

	return (
		<ScrollArea className="container mx-auto p-4 py-8 overflow-y-auto h-[100vh]">
			<div>
				<h1 className="text-3xl font-bold mb-6">Upcoming Sprints</h1>
				{team?.sprintsEnabled ? (
					<>
						<div className="flex flex-col gap-2">
							{upcomingSprints.map((sprint) => (
								<SprintCard key={sprint.id} sprint={sprint} tasks={tasks} />
							))}
						</div>
						{upcomingSprints.length === 0 && (
							<p className="text-center text-muted-foreground mt-8">
								No upcoming sprints found.
							</p>
						)}
					</>
				) : (
					<p className="text-center text-muted-foreground mt-8">
						Sprints are not enabled for this team.
					</p>
				)}
			</div>
		</ScrollArea>
	);
}
