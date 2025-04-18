import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useWorkspaces() {
	const { setWorkspace, setWorkspaces, workspace, workspaces } =
		useWorkspaceStore((state) => state);
	const { organization, isLoaded } = useOrganization();

	const {
		data,
		isPending: loading,
		error,
	} = useQuery({
		queryKey: ["workspaces", "getAllWorkspaces"],
		queryFn: async () => {
			const res = await client.workspace.getAllWorkspaces.$get();
			return res.json();
		},
		enabled: isLoaded,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (data) {
			setWorkspaces(data);

			if (organization?.slug) {
				const currentWorkspace = data.find(
					(ws) => ws.url === organization.slug,
				);
				setWorkspace(currentWorkspace || null);
			}
		}
	}, [data, organization?.slug, setWorkspaces, setWorkspace]);

	const currentWorkspace =
		data && organization?.slug
			? data.find((ws) => ws.url === organization.slug)
			: workspace;

	return {
		loading: loading || !isLoaded,
		error: error ? parseError(error, "Failed to fetch workspaces") : null,
		workspace: currentWorkspace || null,
		workspaces: data || workspaces || [],
	};
}
