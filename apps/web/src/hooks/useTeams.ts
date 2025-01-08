import { client } from "@/lib/client";
import { useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useUsers } from "./useUsers";
import { useWorkspaces } from "./useWorkspaces";

export function useTeams() {
	const { workspace, user, loading: workspaceLoading } = useWorkspaces();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { users, loading: userLoading } = useUsers();

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);

	const { data: authData, isLoading: authLoading } = useQuery({
		queryKey: ["teamAuthorization", user?.id, workspace?.id],
		queryFn: () => {
			if (!user || !workspace || !users.length) return { authorized: false };
			const authorized = users.some((u) => u.id === user.id);
			return { authorized };
		},
		enabled: !!user && !!workspace && !userLoading,
	});

	const {
		data: teamsData,
		isLoading: teamsLoading,
		error,
	} = useQuery({
		queryKey: ["teams", user?.id, workspace?.id, teamIdentifier],
		queryFn: async () => {
			if (!user || !workspace) return { teams: [], team: null };
			const res = await client.team.getUserTeams.$get({
				userId: user.id,
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
			!!user &&
			!!workspace &&
			team?.identifier !== teamIdentifier,
	});

	return {
		loading: workspaceLoading || userLoading || authLoading || teamsLoading,
		team: teamsData?.team || team,
		authorized: authData?.authorized || false,
		teams: teamsData?.teams || teams,
		error: error ? parseError(error, "Failed to fetch teams") : null,
	};
}
