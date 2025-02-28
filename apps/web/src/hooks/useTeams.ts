import { client } from "@/lib/client";
import { useTeamStore, useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useTeams() {
	const { organization, isLoaded } = useOrganization();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { setUsers } = useUserStore((state) => state);

	const params = useParams();
	const teamIdentifier =
		parseParams(params.identifier) ||
		parseParams(params.taskIdentifier)?.split("-")[0];

	const { data: authorized = true, isLoading: authLoading } = useQuery({
		queryKey: ["team", "teamAuthorization", teamIdentifier],
		queryFn: async () => {
			if (!organization || !teamIdentifier) return false;
			const authorized = await client.user.isUserAuthorized
				.$get({
					teamIdentifier,
				})
				.then((res) => res.json());

			return authorized;
		},
		enabled: !!teamIdentifier && isLoaded,
	});

	const {
		data: teamsData,
		isLoading: teamsLoading,
		error,
	} = useQuery({
		queryKey: ["team", organization?.id, teamIdentifier],
		queryFn: async () => {
			if (!organization) return { teams: [], team: null };
			const res = await client.team.getUserTeams.$get({
				workspaceId: organization.id,
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
		enabled:
			authorized && !!organization && team?.identifier !== teamIdentifier,
	});

	return {
		loading: !isLoaded || authLoading || teamsLoading,
		team: teamsData?.team || team,
		authorized,
		teams: teamsData?.teams || teams,
		error: error ? parseError(error, "Failed to fetch teams") : null,
	};
}
