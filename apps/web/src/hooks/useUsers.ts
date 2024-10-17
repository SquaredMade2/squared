import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import { useWorkspaces } from "./useWorkspaces";
import type { User } from "@repo/db";

export function useUsers() {
	const { loading: workspaceLoading, currentWorkspace } = useWorkspaces();
	const getAllUsers = useUserStore((state) => state.getAllUsers);
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const initiateStore = async () => {
			if (workspaceLoading) return;
			setLoading(true);
			if (currentWorkspace) {
				const allUsers = await getAllUsers(currentWorkspace.id);
				setUsers(allUsers);
			}
			setLoading(false);
		};

		initiateStore();
	}, [currentWorkspace, workspaceLoading]);

	return {
		loading,
		users,
	};
}
