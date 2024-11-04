import { useUserStore } from "@/store";
import type { User } from "@squared/db";
import { useEffect, useState } from "react";
import { useWorkspaces } from "./useWorkspaces";

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
