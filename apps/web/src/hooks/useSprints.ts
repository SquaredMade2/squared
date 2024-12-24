import { client } from "@/lib/client";
import {
	useSprintStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { Sprint } from "@squared/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAuthUser } from "./useAuthUser";

export function useSprints(sprintId?: string) {
	const { workspace: workspaceUrl, identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const { setWorkspace } = useWorkspaceStore((state) => state);
	const { setSprint } = useSprintStore((state) => state);
	const { setTeam } = useTeamStore((state) => state);
	const { loading: userLoading } = useAuthUser();

	const workspaceQuery = useQuery({
		queryKey: ["workspace", workspaceUrl],
		queryFn: async () => {
			const res = await client.workspace.getWorkspaceByUrl.$get({
				workspaceUrl: parseParams(workspaceUrl),
			});
			const workspace = await res.json();
			if (!workspace) throw new Error("Workspace not found");
			setWorkspace(workspace);
			return workspace;
		},
		enabled: !userLoading && !!workspaceUrl,
	});

	const teamQuery = useQuery({
		queryKey: ["team", workspaceQuery.data?.id, teamIdentifier],
		queryFn: async () => {
			if (!workspaceQuery.data) return;
			const res = await client.team.getTeamByIdentifier.$get({
				identifier: parseParams(teamIdentifier),
				workspaceId: workspaceQuery.data.id,
			});
			const team = await res.json();
			if (!team) throw new Error("Team not found");
			setTeam(team);
			return team;
		},
		enabled: !!workspaceQuery.data && !!teamIdentifier,
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
		userLoading ||
		workspaceQuery.isLoading ||
		teamQuery.isLoading ||
		sprintsQuery.isLoading ||
		sprintQuery.isLoading ||
		tasksQuery.isLoading;

	const error =
		workspaceQuery.error ||
		teamQuery.error ||
		sprintsQuery.error ||
		sprintQuery.error ||
		tasksQuery.error;

	return {
		workspace: workspaceQuery.data,
		team: teamQuery.data,
		sprints: sprintsQuery.data || [],
		sprint: sprintQuery.data,
		sprintTasks: tasksQuery.data?.sprintTasks || [],
		setSprint,
		loading: isLoading,
		error: parseError(error, "Failed to fetch sprint data"),
	};
}
