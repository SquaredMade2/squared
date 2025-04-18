import { client } from "@/lib/client";
import { useTeamStore, useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function useTeams() {
	const { organization, isLoaded } = useOrganization();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { setUsers } = useUserStore((state) => state);

	const params = useParams();
	const teamIdentifier =
		parseParams(params.identifier) ||
		parseParams(params.taskIdentifier)?.split("-")[0];

	// Query for authorization check
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
		staleTime: 5 * 60 * 1000, // Consider authorization valid for 5 minutes
	});

	// Query for teams - separated from users fetch
	const {
		data: teamsData,
		isLoading: teamsLoading,
		error,
	} = useQuery({
		queryKey: ["teams", organization?.id],
		queryFn: async () => {
			if (!organization) return [];
			const res = await client.team.getUserTeams.$get({
				workspaceId: organization.id,
			});
			return res.json();
		},
		enabled: authorized && !!organization,
		staleTime: 2 * 60 * 1000, // Consider teams data fresh for 2 minutes
	});

	// Query for current team's users - only runs when needed
	const { data: usersData, isLoading: usersLoading } = useQuery({
		queryKey: ["teamUsers", teamIdentifier],
		queryFn: async () => {
			const currentTeam = teamsData?.find(
				(t) => t.identifier === teamIdentifier,
			);
			if (!currentTeam) return [];

			const res = await client.user.getTeamUsers.$get({
				teamId: currentTeam.id,
			});
			return res.json();
		},
		enabled: !!teamsData && !!teamIdentifier && authorized,
		staleTime: 2 * 60 * 1000,
	});

	// Update global state based on query results - outside of queryFn
	useEffect(() => {
		if (teamsData) {
			setTeams(teamsData);
		}
	}, [teamsData, setTeams]);

	useEffect(() => {
		if (teamsData && teamIdentifier) {
			const currentTeam = teamsData.find(
				(t) => t.identifier === teamIdentifier,
			);
			if (currentTeam) {
				setTeam(currentTeam);
			}
		}
	}, [teamsData, teamIdentifier, setTeam]);

	useEffect(() => {
		if (usersData) {
			setUsers(usersData);
		}
	}, [usersData, setUsers]);

	// Determine current team from the data
	const currentTeam =
		teamsData?.find((t) => t.identifier === teamIdentifier) || team;

	return {
		loading: !isLoaded || authLoading || teamsLoading || usersLoading,
		team: currentTeam,
		authorized,
		teams: teamsData || teams,
		error: error ? parseError(error, "Failed to fetch teams") : null,
	};
}
