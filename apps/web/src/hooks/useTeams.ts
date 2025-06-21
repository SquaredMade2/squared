import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { client } from "@/lib/client";
import { useTeamStore, useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";

export function useTeams() {
	const { organization, isLoaded } = useOrganization();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { setUsers } = useUserStore((state) => state);

	const params = useParams();
	const teamIdentifier =
		parseParams(params.identifier) ||
		parseParams(params.taskIdentifier)?.split("-")[0];

	const { data: authorized = true, isLoading: authLoading } = useQuery({
		enabled: !!teamIdentifier && isLoaded,
		queryFn: async () => {
			if (!(organization && teamIdentifier)) return false;
			return await client.user.isUserAuthorized
				.$get({
					teamIdentifier,
				})
				.then((res) => res.json());
		},
		queryKey: ["team", "teamAuthorization", teamIdentifier],
	});

	const {
		data: teamsData,
		isLoading: teamsLoading,
		error,
	} = useQuery({
		enabled:
			authorized && !!organization && team?.identifier !== teamIdentifier,
		queryFn: async () => {
			if (!organization) return { team: null, teams: [] };
			const res = await client.team.getUserTeams.$get();
			const allTeams = await res.json();
			setTeams(allTeams);
			const currentTeam = allTeams.find((t) => t.identifier === teamIdentifier);
			if (currentTeam) {
				setTeam(currentTeam);
				setUsers(
					await client.user.getTeamUsers
						.$get({
							teamId: currentTeam.id,
						})
						.then((r) => r.json()),
				);
			}
			return { team: currentTeam || null, teams: allTeams };
		},
		queryKey: ["team", organization?.id, teamIdentifier],
	});

	return {
		authorized,
		error: error ? parseError(error, "Failed to fetch teams") : null,
		loading: !isLoaded || authLoading || teamsLoading,
		team: teamsData?.team || team,
		teams: teamsData?.teams || teams,
	};
}
