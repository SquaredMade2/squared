import { client } from "@/lib/client";
import { useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useWorkspaces } from "./useWorkspaces";

export function useTeams() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);

	const { data: authData, isLoading: authLoading } = useQuery({
		queryKey: ["teamAuthorization", teamIdentifier],
		queryFn: async () => {
			if (!workspace || !teamIdentifier) return { authorized: false };
			const authorized = await client.user.isUserAuthorized.$get({
				teamIdentifier,
			});
			return { authorized };
		},
		enabled: !!teamIdentifier,
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
			if (currentTeam) setTeam(currentTeam);
			return { teams: allTeams, team: currentTeam || null };
		},
		enabled:
			!!authData?.authorized &&
			!!workspace &&
			team?.identifier !== teamIdentifier,
	});

	return {
		loading: workspaceLoading || authLoading || teamsLoading,
		team: teamsData?.team || team,
		authorized: authData?.authorized || false,
		teams: teamsData?.teams || teams,
		error: error ? parseError(error, "Failed to fetch teams") : null,
	};
}
