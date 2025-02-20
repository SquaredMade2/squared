import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useWorkspaces() {
	const { setWorkspace, setWorkspaces } = useWorkspaceStore((state) => state);
	const { organization, isLoaded } = useOrganization();

	const {
		data,
		isPending: loading,
		error,
	} = useQuery({
		queryKey: ["workspaces", organization?.slug],
		queryFn: async () => {
			const res = await client.workspace.getAllWorkspaces.$get();
			const awaitedRes = await res.json();
			const workspace = awaitedRes.find((ws) => ws.url === organization?.slug);
			setWorkspaces(awaitedRes);
			setWorkspace(workspace || null);
			return { workspace, workspaces: awaitedRes };
		},
	});

	return {
		loading: loading || !isLoaded,
		error: parseError(error, "Failed to fetch workspaces"),
		workspace: data?.workspace,
		workspaces: data?.workspaces,
	};
}
