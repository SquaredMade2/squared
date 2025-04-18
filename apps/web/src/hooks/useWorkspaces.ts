import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useWorkspaces() {
	const {
		setWorkspace,
		setWorkspaces,
		workspace: storeWorkspace,
		workspaces: storeWorkspaces,
	} = useWorkspaceStore((state) => state);
	const { organization, isLoaded: isOrgLoaded } = useOrganization();
	const { user, isLoaded: isUserLoaded } = useUser();

	// Use stale time to prevent excessive refetching
	const {
		data,
		isPending: loading,
		error,
	} = useQuery({
		queryKey: ["workspace", "getAllWorkspaces", organization?.slug],
		queryFn: async () => {
			if (!organization?.slug) {
				throw new Error("Organization slug is required");
			}

			const res = await client.workspace.getAllWorkspaces.$get();
			const workspaces = await res.json();

			// Find workspace matching current organization
			const workspace = workspaces.find((ws) => ws.url === organization?.slug);

			// Only update store if there's a change
			if (JSON.stringify(storeWorkspaces) !== JSON.stringify(workspaces)) {
				setWorkspaces(workspaces);
			}

			if (
				workspace &&
				(!storeWorkspace || storeWorkspace.id !== workspace.id)
			) {
				setWorkspace(workspace);
			}

			return { workspace, workspaces };
		},
		// Skip fetching if organization isn't loaded yet
		enabled: !!organization?.slug,
		// Cache results for 5 minutes to reduce refetches
		staleTime: 5 * 60 * 1000,
		// Retry failed requests
		retry: 2,
	});

	// Compute and memoize derived values
	const isLoading = useMemo(
		() => loading || !isOrgLoaded || !isUserLoaded,
		[loading, isOrgLoaded, isUserLoaded],
	);

	const errorMessage = useMemo(
		() => parseError(error, "Failed to fetch workspaces"),
		[error],
	);

	const currentWorkspace = useMemo(
		() => data?.workspace || storeWorkspace,
		[data?.workspace, storeWorkspace],
	);

	const workspaces = useMemo(
		() => data?.workspaces || storeWorkspaces,
		[data?.workspaces, storeWorkspaces],
	);

	// Return memoized result
	return useMemo(
		() => ({
			loading: isLoading,
			error: errorMessage,
			workspace: currentWorkspace,
			workspaces,
			user,
			organization,
		}),
		[isLoading, errorMessage, currentWorkspace, workspaces, user, organization],
	);
}
