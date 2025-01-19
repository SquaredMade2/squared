import { client } from "@/lib/client";
import { useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaces } from "./useWorkspaces";

export function useUsers() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { setUsers } = useUserStore((state) => state);

	const {
		data: users,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users", workspace?.id],
		queryFn: async () => {
			if (!workspace) return [];
			const res = await client.user.getAllUsers.$get({
				workspaceId: workspace.id,
			});
			const workspaceUsers = await res.json();
			setUsers(workspaceUsers);
			return workspaceUsers;
		},
		enabled: !!workspace && !workspaceLoading,
	});

	return {
		loading: isLoading || workspaceLoading,
		users: users || [],
		error: error ? parseError(error, "Failed to fetch users") : null,
	};
}
