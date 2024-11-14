import { userService } from "@/lib/services";
import { useUserStore } from "@/store";
import { TODO } from "@squared/context";
import { useEffect, useState } from "react";
import { useWorkspaces } from "./useWorkspaces";

export function useUsers() {
	const { loading: workspaceLoading, workspace } = useWorkspaces();
	const { users, setUsers } = useUserStore((state) => state);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initiateStore = async () => {
			if (workspaceLoading) return;
			setLoading(true);
			if (workspace) {
				setUsers(
					await userService.getWorkspaceUsers(TODO, {
						workspaceId: workspace.id,
					}),
				);
			}
			setLoading(false);
		};

		initiateStore();
	}, [workspace, workspaceLoading]);

	return {
		loading,
		users,
	};
}
