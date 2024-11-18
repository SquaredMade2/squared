import {
	sprintService,
	taskService,
	teamService,
	workspaceService,
} from "@/lib/services";
import {
	useSprintStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { parseParams } from "@/utils/parseParams";
import * as context from "@squared/context";
import type { Sprint, Task } from "@squared/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthUser } from "./useAuthUser";

export function useSprints(sprintId?: string) {
	const { workspace: workspaceUrl, identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sprintTasks, setSprintTasks] = useState<Task[]>([]);

	const { setSprint, sprint } = useSprintStore((state) => state);
	const { setTeam, team } = useTeamStore((state) => state);
	const { user, loading: userLoading } = useAuthUser();

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				if (userLoading) {
					return;
				}

				// Fetch workspace data
				const workspace = await workspaceService.getWorkspaceByUrl(
					context.TODO,
					{
						url: parseParams(workspaceUrl),
					},
				);
				if (!workspace) {
					throw new Error("Workspace not found");
				}
				setWorkspace(workspace);

				if (!user) {
					throw new Error("User not found");
				}

				// Fetch team data

				const foundTeam = await teamService.getTeamByIdentifier(context.TODO, {
					identifier: parseParams(teamIdentifier),
					workspaceId: workspace.id,
				});
				if (!foundTeam) {
					throw new Error("Team not found");
				}
				setTeam(foundTeam);

				const sprints = await sprintService.getSprints(context.TODO, {
					teamId: foundTeam.id,
				});
				if (!sprints.length) {
					throw new Error("No sprints found");
				}
				setSprints(sprints);

				const foundSprint = sprintId
					? sprints.find((sprint) => sprint.id === sprintId)
					: sprints.find((sprint) => sprint.status === "ACTIVE");

				if (!foundSprint) {
					throw new Error("Sprint not found");
				}
				const [sprintTasks, tasks] = await Promise.all([
					sprintService.getSprintTasks(context.TODO, {
						sprintId: foundSprint.id,
					}),
					taskService.getTeamTasks(context.TODO, {
						teamId: foundTeam.id,
					}),
				]);
				setTasks(tasks);
				setSprintTasks(sprintTasks);
				setSprint(foundSprint);

				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setLoading(false);
			}
		}

		fetchData();
	}, [workspaceUrl, teamIdentifier, userLoading]);

	return {
		workspace,
		team,
		sprints,
		sprint,
		sprintTasks,
		setSprint,
		loading,
		error,
	};
}
