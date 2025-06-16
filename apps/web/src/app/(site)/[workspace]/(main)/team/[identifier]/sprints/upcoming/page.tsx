"use client";

import { SprintError, SprintLoading } from "@/components/Sprints";
import { SprintCard } from "@/components/Sprints/SprintCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSprints } from "@/hooks/useSprints";
import { useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";

export default function UpcomingSprints() {
	const { organization, team, sprints, loading, error } = useSprints();
	const { tasks } = useTaskStore((state) => state);

	if (loading) {
		return <SprintLoading />;
	}

	if (error) {
		return (
			<SprintError
				error={parseError(error, "Failed to fetch sprint data")}
				teamIdentifier={team?.identifier}
				workspaceUrl={organization?.slug ?? ""}
			/>
		);
	}

	const upcomingSprints = sprints.filter(
		(sprint) => sprint.status === "PLANNED",
	);

	return (
		<ScrollArea className="container mx-auto h-[100vh] overflow-y-auto py-3">
			<div>
				<h1 className="mb-6 pl-12 font-bold text-3xl">Upcoming Sprints</h1>
				{team?.sprintsEnabled ? (
					<>
						<div className="flex flex-col gap-2">
							{upcomingSprints.map((sprint) => (
								<SprintCard key={sprint.id} sprint={sprint} tasks={tasks} />
							))}
						</div>
						{upcomingSprints.length === 0 && (
							<p className="mt-8 text-center text-muted-foreground">
								No upcoming sprints found.
							</p>
						)}
					</>
				) : (
					<p className="mt-8 text-center text-muted-foreground">
						Sprints are not enabled for this team.
					</p>
				)}
			</div>
		</ScrollArea>
	);
}
