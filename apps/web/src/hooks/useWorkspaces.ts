import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useWorkspaces() {
	const { setWorkspace, setWorkspaces, workspace } = useWorkspaceStore(
		(state) => state,
	);

	const params = useParams();
	const workspaceUrl = parseParams(params.workspace) || workspace?.url;

	const {
		data,
		isPending: loading,
		error,
	} = useQuery({
		queryKey: ["workspaces", workspaceUrl],
		queryFn: async () => {
			const res = await client.workspace.getAllWorkspaces.$get();
			const awaitedRes = await res.json();
			const workspace = awaitedRes.find((ws) => ws.url === workspaceUrl);
			setWorkspaces(awaitedRes);
			setWorkspace(workspace || null);
			return { workspace, workspaces: awaitedRes };
		},
	});

	return {
		loading,
		error: parseError(error, "Failed to fetch workspaces"),
		workspace: data?.workspace,
		workspaces: data?.workspaces,
	};
}
