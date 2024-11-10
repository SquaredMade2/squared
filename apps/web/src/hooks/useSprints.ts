import { sprintService, taskService, workspaceService } from "@/lib/services";
import { useTaskStore, useTeamStore, useWorkspaceStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import * as context from "@squared/context";
import type { Sprint, Task, Team } from "@squared/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthUser } from "./useAuthUser";

export function useSprints(sprintId?: string) {
	const { workspace: workspaceUrl, identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);
	const [team, setTeam] = useState<Team | null>(null);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sprintTasks, setSprintTasks] = useState<Task[]>([]);

	const { getAllTeams, setCurrentSprint, currentSprint } = useTeamStore(
		(state) => state,
	);
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
				const teams = await getAllTeams(user.id);
				const foundTeam = teams.find(
					(team) => team.identifier === teamIdentifier,
				);
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
				setCurrentSprint(foundSprint);

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
		currentSprint,
		sprintTasks,
		setCurrentSprint,
		loading,
		error,
	};
}
