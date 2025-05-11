import { client } from "@/lib/client";
import { useSprintStore, useTaskStore, useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import type { Sprint } from "@squaredmade/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useSprints(sprintId?: string) {
	const { organization, isLoaded } = useOrganization();
	const { identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const { setSprint } = useSprintStore((state) => state);
	const { setTeam } = useTeamStore((state) => state);

	const teamQuery = useQuery({
		queryKey: ["team", organization?.id, teamIdentifier],
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
		enabled: !!organization && !!teamIdentifier,
	});

	const sprintsQuery = useQuery({
		queryKey: ["sprints", teamQuery.data?.id],
		queryFn: async () => {
			if (!teamQuery.data) return;
			const res = await client.sprint.getSprints.$get({
				teamId: teamQuery.data.id,
			});
			const sprints = await res.json();
			if (!sprints.length) throw new Error("No sprints found");
			return sprints;
		},
		enabled: !!teamQuery.data,
	});

	const activeSprint =
		sprintsQuery.data?.find((s) => s.status === "ACTIVE") ?? null;

	const upcomingSprints =
		sprintsQuery.data?.filter((s) => s.status === "PLANNED") ?? [];

	const sprintQuery = useQuery({
		queryKey: ["sprint", sprintsQuery.data, sprintId],
		queryFn: async () => {
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
		enabled: !!sprintsQuery.data,
	});

	const tasksQuery = useQuery({
		queryKey: ["tasks", teamQuery.data?.id, sprintQuery.data?.id],
		queryFn: async () => {
			if (!teamQuery.data || !sprintQuery.data) return;
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
		enabled: !!teamQuery.data && !!sprintQuery.data,
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
		organization,
		team: teamQuery.data,
		sprints: sprintsQuery.data || [],
		sprint: sprintQuery.data,
		sprintTasks: tasksQuery.data?.sprintTasks || [],
		setSprint,
		loading: isLoading,
		error: error,
		activeSprint,
		upcomingSprints,
	};
}
