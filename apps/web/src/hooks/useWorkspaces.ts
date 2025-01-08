import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useWorkspaces() {
	const { user, isLoaded, isSignedIn } = useUser();
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
			if (!user || !isSignedIn) return;
			const res = await client.workspace.getAllWorkspaces.$get({
				userId: user.id,
			});
			const awaitedRes = await res.json();
			const workspace = awaitedRes.find((ws) => ws.url === workspaceUrl);
			setWorkspaces(awaitedRes);
			setWorkspace(workspace || null);
			return { workspace, workspaces: awaitedRes };
		},
		enabled: !!user && isLoaded,
	});

	return {
		user,
		loading: isLoaded || loading,
		error: parseError(error, "Failed to fetch workspaces"),
		workspace: data?.workspace,
		workspaces: data?.workspaces,
	};
}
