import { client } from "@/lib/client";
import { useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import type { OrganizationResource } from "@clerk/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useWorkspaces() {
	const { setWorkspace, setWorkspaces } = useWorkspaceStore((state) => state);
	const { organization, isLoaded } = useOrganization();
	const { setActive } = useOrganizationList();
	const queryClient = useQueryClient();

	const {
		data,
		isPending: loading,
		error,
	} = useQuery({
		queryKey: ["workspace", "getAllWorkspaces", organization?.slug],
		queryFn: async () => {
			const res = await client.workspace.getAllWorkspaces.$get();
			const awaitedRes = await res.json();
			const workspace = awaitedRes.find((ws) => ws.url === organization?.slug);
			setWorkspaces(awaitedRes);
			setWorkspace(workspace || null);
			return { workspace, workspaces: awaitedRes };
		},
	});

	const switchWorkspace = async (org: OrganizationResource) => {
		const keysToRemove = ["task", "tasks"];
		await setActive?.({ organization: org });
		for (const key of keysToRemove) {
			queryClient.removeQueries({ queryKey: [key], exact: false });
		}
		for (const key of keysToRemove) {
			queryClient.invalidateQueries({ queryKey: [key], refetchType: "active" });
		}
	};

	return {
		loading: loading || !isLoaded,
		error: parseError(error, "Failed to fetch workspaces"),
		workspace: data?.workspace,
		workspaces: data?.workspaces,
		switchWorkspace,
	};
}
