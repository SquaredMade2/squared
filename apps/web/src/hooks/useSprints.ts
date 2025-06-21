import { useOrganization } from "@clerk/nextjs";
import type { Sprint } from "@squaredmade/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { client } from "@/lib/client";
import { useSprintStore, useTaskStore, useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";

export function useSprints(sprintId?: string) {
	const { organization, isLoaded } = useOrganization();
	const { identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const { setSprint } = useSprintStore((state) => state);
	const { setTeam } = useTeamStore((state) => state);

	const teamQuery = useQuery({
		enabled: !!organization && !!teamIdentifier,
		queryFn: async () => {
			const parsedTeamIdentifier = parseParams(teamIdentifier);
			if (!organization) return;
			if (!parsedTeamIdentifier) throw new Error("Team not found");
			const res = await client.team.getTeamByIdentifier.$get({
				identifier: parsedTeamIdentifier,
			});
			const team = await res.json();
			if (!team) throw new Error("Team not found");
			setTeam(team);
			return team;
		},
		queryKey: ["team", organization?.id, teamIdentifier],
	});

	const sprintsQuery = useQuery({
		enabled: !!teamQuery.data?.id,
		queryFn: async () => {
			if (!teamQuery.data) return;
			const res = await client.sprint.getSprints.$get({
				teamId: teamQuery.data.id,
			});
			const sprints = await res.json();
			if (sprints.length === 0) throw new Error("No sprints found");
			return sprints;
		},
		queryKey: ["sprints", teamQuery.data?.id],
	});

	const activeSprint =
		sprintsQuery.data?.find((s) => s.status === "ACTIVE") ?? null;

	const upcomingSprints =
		sprintsQuery.data?.filter((s) => s.status === "PLANNED") ?? [];

	const sprintQuery = useQuery({
		enabled: !!sprintsQuery.data,
		queryFn: () => {
			if (!sprintsQuery.data) return;
			const foundSprint = sprintId
				? sprintsQuery.data.find((sprint: Sprint) => sprint.id === sprintId)
				: sprintsQuery.data.find(
						(sprint: Sprint) => sprint.status === "ACTIVE",
					);
			if (!foundSprint) throw new Error("Sprint not found");
			setSprint(foundSprint);
			return foundSprint;
		},
		queryKey: ["sprint", sprintsQuery.data, sprintId],
	});

	const tasksQuery = useQuery({
		enabled: !!teamQuery.data && !!sprintQuery.data,
		queryFn: async () => {
			if (!(teamQuery.data && sprintQuery.data)) return;
			const [sprintTasksRes, teamTasksRes] = await Promise.all([
				client.sprint.getSprintTasks.$get({
					sprintId: sprintQuery.data.id,
				}),
				client.task.getAllTasks.$get({
					teamId: teamQuery.data.id,
				}),
			]);
			const [sprintTasks, teamTasks] = await Promise.all([
				sprintTasksRes.json(),
				teamTasksRes.json(),
			]);
			setTasks(teamTasks);
			return { sprintTasks, teamTasks };
		},
		queryKey: ["tasks", teamQuery.data?.id, sprintQuery.data?.id],
	});

	const isLoading =
		!isLoaded ||
		teamQuery.isLoading ||
		sprintsQuery.isLoading ||
		sprintQuery.isLoading ||
		tasksQuery.isLoading;

	const error =
		teamQuery.error ||
		sprintsQuery.error ||
		sprintQuery.error ||
		tasksQuery.error;

	return {
		activeSprint,
		error,
		loading: isLoading,
		organization,
		setSprint,
		sprint: sprintQuery.data,
		sprints: sprintsQuery.data || [],
		sprintTasks: tasksQuery.data?.sprintTasks || [],
		team: teamQuery.data,
		upcomingSprints,
	};
}
