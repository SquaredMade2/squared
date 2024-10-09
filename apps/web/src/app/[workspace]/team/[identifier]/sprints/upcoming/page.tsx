"use client";

import { useSprints } from "@/hooks/useSprints";
import { SprintError, SprintLoading } from "@/components/Sprints";
import { useTaskStore } from "@/store";
import { SprintCard } from "@/components/Sprints/SprintCard";

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
		<div className="container mx-auto px-4 py-8">
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
	);
}
