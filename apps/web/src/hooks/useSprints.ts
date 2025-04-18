import { useError } from "@/context/ErrorContext";
import { useLoading } from "@/context/LoadingContext";
import { client } from "@/lib/client";
import { useSprintStore, useTaskStore, useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import type { Sprint } from "@squaredmade/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useSprints(sprintId?: string) {
	const { organization, isLoaded } = useOrganization();
	const { identifier: teamIdentifier } = useParams();
	const { setTasks } = useTaskStore((state) => state);
	const { sprint: storeSprint, setSprint } = useSprintStore((state) => state);
	const { team: storeTeam, setTeam } = useTeamStore((state) => state);

	// Use the global loading and error contexts
	const { startLoading, stopLoading } = useLoading();
	const { setError, clearError } = useError();

	// Memoize the parsed team identifier
	const parsedTeamIdentifier = useMemo(
		() => parseParams(teamIdentifier),
		[teamIdentifier],
	);

	// Memoize the team fetch function
	const fetchTeam = useCallback(async () => {
		if (!organization) return;
		if (!parsedTeamIdentifier) throw new Error("Team not found");

		const loadingKey = `team-${parsedTeamIdentifier}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.team.getTeamByIdentifier.$get({
				identifier: parsedTeamIdentifier,
			});
			const team = await res.json();

			if (!team) throw new Error("Team not found");

			// Only update if different
			if (!storeTeam || storeTeam.id !== team.id) {
				setTeam(team);
			}

			return team;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		organization,
		parsedTeamIdentifier,
		storeTeam,
		setTeam,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const teamQuery = useQuery({
		queryKey: ["team", organization?.id, parsedTeamIdentifier],
		queryFn: fetchTeam,
		enabled: !!organization && !!parsedTeamIdentifier,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Memoize the sprints fetch function
	const fetchSprints = useCallback(async () => {
		if (!teamQuery.data) return;

		const loadingKey = `sprints-${teamQuery.data.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.sprint.getSprints.$get({
				teamId: teamQuery.data.id,
			});
			const sprints = await res.json();

			if (!sprints.length) throw new Error("No sprints found");

			return sprints;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [teamQuery.data, startLoading, stopLoading, setError, clearError]);

	const sprintsQuery = useQuery({
		queryKey: ["sprints", teamQuery.data?.id],
		queryFn: fetchSprints,
		enabled: !!teamQuery.data,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Memoize the sprint fetch function
	const fetchSprint = useCallback(async () => {
		if (!sprintsQuery.data) return;

		const foundSprint = sprintId
			? sprintsQuery.data.find((sprint: Sprint) => sprint.id === sprintId)
			: sprintsQuery.data.find((sprint: Sprint) => sprint.status === "ACTIVE");

		if (!foundSprint) throw new Error("Sprint not found");

		// Only update if different
		if (!storeSprint || storeSprint.id !== foundSprint.id) {
			setSprint(foundSprint);
		}

		return foundSprint;
	}, [sprintsQuery.data, sprintId, storeSprint, setSprint]);

	const sprintQuery = useQuery({
		queryKey: ["sprint", sprintsQuery.data, sprintId],
		queryFn: fetchSprint,
		enabled: !!sprintsQuery.data,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Memoize the tasks fetch function
	const fetchTasks = useCallback(async () => {
		if (!teamQuery.data || !sprintQuery.data) return;

		const loadingKey = `sprint-tasks-${sprintQuery.data.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const [sprintTasksRes, teamTasksRes] = await Promise.all([
				client.sprint.getSprintTasks.$get({
					sprintId: sprintQuery.data.id,
				}),
				client.task.getAllTasks.$get({
					teamId: teamQuery.data.id,
				}),
			]);

			const [sprintTasks, teamTasks] = await Promise.all([
				sprintTasksRes.json(),
				teamTasksRes.json(),
			]);

			// Only update if tasks have changed
			setTasks(teamTasks);

			return { sprintTasks, teamTasks };
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		teamQuery.data,
		sprintQuery.data,
		setTasks,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const tasksQuery = useQuery({
		queryKey: ["tasks", teamQuery.data?.id, sprintQuery.data?.id],
		queryFn: fetchTasks,
		enabled: !!teamQuery.data && !!sprintQuery.data,
		staleTime: 2 * 60 * 1000, // 2 minutes - tasks may change more often
	});

	// Memoize computed values
	const isLoading = useMemo(
		() =>
			!isLoaded ||
			teamQuery.isLoading ||
			sprintsQuery.isLoading ||
			sprintQuery.isLoading ||
			tasksQuery.isLoading,
		[
			isLoaded,
			teamQuery.isLoading,
			sprintsQuery.isLoading,
			sprintQuery.isLoading,
			tasksQuery.isLoading,
		],
	);

	const error = useMemo(
		() =>
			teamQuery.error ||
			sprintsQuery.error ||
			sprintQuery.error ||
			tasksQuery.error,
		[teamQuery.error, sprintsQuery.error, sprintQuery.error, tasksQuery.error],
	);

	const sprints = useMemo(() => sprintsQuery.data || [], [sprintsQuery.data]);
	const sprint = useMemo(() => sprintQuery.data, [sprintQuery.data]);
	const sprintTasks = useMemo(
		() => tasksQuery.data?.sprintTasks || [],
		[tasksQuery.data?.sprintTasks],
	);

	// Return memoized result
	return useMemo(
		() => ({
			organization,
			team: teamQuery.data,
			sprints,
			sprint,
			sprintTasks,
			setSprint,
			loading: isLoading,
			error,
		}),
		[
			organization,
			teamQuery.data,
			sprints,
			sprint,
			sprintTasks,
			setSprint,
			isLoading,
			error,
		],
	);
}
