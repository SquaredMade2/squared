import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTeamStore, useWorkspaceStore } from "@/store";
import type { Sprint, Team, Workspace } from "@repo/db";
import { parseParams } from "@/utils/parseParams";

export function useSprints() {
	const { workspace: workspaceUrl, identifier: teamIdentifier } = useParams();
	const [workspace, setWorkspace] = useState<Workspace | null>(null);
	const [team, setTeam] = useState<Team | null>(null);
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { getWorkspace } = useWorkspaceStore((state) => state);
	const { getAllTeams, getSprints, currentSprint, setCurrentSprint } =
		useTeamStore((state) => state);

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

				// Fetch team data
				const teams = await getAllTeams(workspace.id);
				const foundTeam = teams.find(
					(team) => team.identifier === teamIdentifier,
				);
				if (!foundTeam) {
					throw new Error("Team not found");
				}
				setTeam(foundTeam);

				const sprints = await getSprints(foundTeam.id);
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
				setCurrentSprint(foundSprint);

				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setLoading(false);
			}
		}

		fetchData();
	}, [workspaceUrl, teamIdentifier]);

	return {
		workspace,
		team,
		sprints,
		currentSprint,
		setCurrentSprint,
		loading,
		error,
	};
}
