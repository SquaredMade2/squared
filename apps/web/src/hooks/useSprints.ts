import { sprintService, taskService } from "@/lib/services";
import {
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { parseParams } from "@/utils/parseParams";
import * as context from "@squared/context";
import type { Sprint, Task, Team, Workspace } from "@squared/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useSprints() {
	const { workspace: workspaceUrl, identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const [workspace, setWorkspace] = useState<Workspace | null>(null);
	const [team, setTeam] = useState<Team | null>(null);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sprintTasks, setSprintTasks] = useState<Task[]>([]);

	const { getWorkspace } = useWorkspaceStore((state) => state);
	const { getAllTeams, setCurrentSprint, currentSprint } = useTeamStore(
		(state) => state,
	);
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);

				// Fetch workspace data
				const { workspace, message: workspaceMessage } = await getWorkspace(
					parseParams(workspaceUrl),
				);
				if (!workspace) {
					throw new Error(workspaceMessage || "Workspace not found");
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

				const foundSprint = sprints.find(
					(sprint) => sprint.status === "ACTIVE",
				);
				if (!foundSprint) {
					throw new Error("No active sprint found");
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
	}, [workspaceUrl, teamIdentifier, user]);

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
