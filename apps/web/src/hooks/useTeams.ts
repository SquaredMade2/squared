import { useError } from "@/context/ErrorContext";
import { useLoading } from "@/context/LoadingContext";
import { client } from "@/lib/client";
import { useTeamStore, useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useTeams() {
	const { organization, isLoaded } = useOrganization();
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { setUsers } = useUserStore((state) => state);

	// Use the global loading and error contexts
	const { startLoading, stopLoading } = useLoading();
	const { setError, clearError } = useError();

	const params = useParams();

	// Memoize the parsed identifier to avoid recalculating on every render
	const teamIdentifier = useMemo(() => {
		const identifier = parseParams(params.identifier);
		if (identifier) return identifier;

		const taskIdentifier = parseParams(params.taskIdentifier);
		return taskIdentifier?.split("-")[0];
	}, [params.identifier, params.taskIdentifier]);

	// Memoize authorization query function
	const authorizeUser = useCallback(async () => {
		if (!organization || !teamIdentifier) return false;

		const loadingKey = `authorize-${teamIdentifier}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const authorized = await client.user.isUserAuthorized
				.$get({
					teamIdentifier,
				})
				.then((res) => res.json());

			return authorized;
		} catch (error) {
			setError(loadingKey, error as Error);
			return false;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		organization,
		teamIdentifier,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const { data: authorized = true, isLoading: authLoading } = useQuery({
		queryKey: ["team", "teamAuthorization", teamIdentifier],
		queryFn: authorizeUser,
		enabled: !!teamIdentifier && isLoaded,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});

	// Memoize teams query function
	const fetchTeams = useCallback(async () => {
		if (!organization) return { teams: [], team: null };

		const loadingKey = `teams-${organization.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.team.getUserTeams.$get({
				workspaceId: organization.id,
			});
			const allTeams = await res.json();

			// Only update if different
			if (JSON.stringify(teams) !== JSON.stringify(allTeams)) {
				setTeams(allTeams);
			}

			const currentTeam = allTeams.find((t) => t.identifier === teamIdentifier);

			if (currentTeam) {
				// Only update team if different
				if (!team || team.id !== currentTeam.id) {
					setTeam(currentTeam);
				}

				// Fetch team users
				const usersRes = await client.user.getTeamUsers.$get({
					teamId: currentTeam.id,
				});
				const users = await usersRes.json();
				setUsers(users);
			}

			return { teams: allTeams, team: currentTeam || null };
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		organization,
		teams,
		team,
		teamIdentifier,
		setTeams,
		setTeam,
		setUsers,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const {
		data: teamsData,
		isLoading: teamsLoading,
		error,
	} = useQuery({
		queryKey: ["team", organization?.id, teamIdentifier],
		queryFn: fetchTeams,
		enabled:
			authorized && !!organization && team?.identifier !== teamIdentifier,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Memoize computed values
	const loading = useMemo(
		() => !isLoaded || authLoading || teamsLoading,
		[isLoaded, authLoading, teamsLoading],
	);

	const currentTeam = useMemo(
		() => teamsData?.team || team,
		[teamsData?.team, team],
	);

	const currentTeams = useMemo(
		() => teamsData?.teams || teams,
		[teamsData?.teams, teams],
	);

	const errorMessage = useMemo(
		() => (error ? parseError(error, "Failed to fetch teams") : null),
		[error],
	);

	// Return memoized result
	return useMemo(
		() => ({
			loading,
			team: currentTeam,
			authorized,
			teams: currentTeams,
			error: errorMessage,
		}),
		[loading, currentTeam, authorized, currentTeams, errorMessage],
	);
}
