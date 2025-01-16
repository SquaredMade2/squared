import { client } from "@/lib/client";
import { useTeamStore, useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useWorkspaces } from "./useWorkspaces";

export function useTeams() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { setUsers } = useUserStore((state) => state);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);

	const { data: authorized = true, isLoading: authLoading } = useQuery({
		queryKey: ["teamAuthorization", teamIdentifier],
		queryFn: async () => {
			if (!workspace || !teamIdentifier) return false;
			const authorized = await client.user.isUserAuthorized
				.$get({
					teamIdentifier,
				})
				.then((res) => res.json());

			return authorized;
		},
		enabled: !!teamIdentifier && !workspaceLoading,
	});

	const {
		data: teamsData,
		isLoading: teamsLoading,
		error,
	} = useQuery({
		queryKey: ["teams", workspace?.id, teamIdentifier],
		queryFn: async () => {
			if (!workspace) return { teams: [], team: null };
			const res = await client.team.getUserTeams.$get({
				workspaceId: workspace.id,
			});
			const allTeams = await res.json();
			setTeams(allTeams);
			const currentTeam = allTeams.find((t) => t.identifier === teamIdentifier);
			if (currentTeam) {
				setTeam(currentTeam);
				const users = await client.user.getTeamUsers
					.$get({
						teamId: currentTeam.id,
					})
					.then((res) => res.json());
				setUsers(users);
			}
			return { teams: allTeams, team: currentTeam || null };
		},
		enabled: authorized && !!workspace && team?.identifier !== teamIdentifier,
	});

	return {
		loading: workspaceLoading || authLoading || teamsLoading,
		team: teamsData?.team || team,
		authorized,
		teams: teamsData?.teams || teams,
		error: error ? parseError(error, "Failed to fetch teams") : null,
	};
}
