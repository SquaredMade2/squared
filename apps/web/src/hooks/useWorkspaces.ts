import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAuthUser } from "./useAuthUser";

export function useWorkspaces() {
	const { user, loading: userLoading, error: userError } = useAuthUser();
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
		queryKey: ["workspaces", user?.id],
		queryFn: async () => {
			if (!user) return;
			const res = await client.workspace.getAllWorkspaces.$get({
				userId: user.id,
			});
			const awaitedRes = await res.json();
			const workspace = awaitedRes.find((ws) => ws.url === workspaceUrl);
			setWorkspaces(awaitedRes);
			setWorkspace(workspace || null);
			return { workspace, workspaces: awaitedRes };
		},
		enabled: !!user && !userLoading,
	});

	return {
		user,
		loading: userLoading || loading,
		error:
			error || userError
				? parseError(error, "Failed to fetch workspaces")
				: null,
		workspace: data?.workspace,
		workspaces: data?.workspaces,
	};
}
