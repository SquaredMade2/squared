import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWorkspaceStore } from "@/store";
import type { Workspace } from "@/store/workspaces";
import { parseParams } from "@/utils/parseParams";
import { useAuthUser } from "./useAuthUser";

export function useWorkspaces() {
	const { user, loading: userLoading, error: userError } = useAuthUser();
	const { currentWorkspace, getAllWorkspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const [loading, setLoading] = useState(true);
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
	const [error, setError] = useState<string | null>(null);

	const params = useParams();
	const workspaceUrl = parseParams(params.workspace);

	useEffect(() => {
		const initiateStore = async () => {
			if (userLoading) return;

			setLoading(true);
			setError(null);

			try {
				if (user) {
					const allWorkspaces = await getAllWorkspaces(user.id);
					setWorkspaces(allWorkspaces);
					const workspace = allWorkspaces?.find(
						(ws) => ws.url === workspaceUrl,
					);
					if (workspace) {
						setCurrentWorkspace(workspace);
					} else if (workspaceUrl) {
						setError(`Workspace with URL "${workspaceUrl}" not found`);
					}
				} else if (userError) {
					setError(userError);
				}
			} catch (err) {
				console.error("Error fetching workspaces:", err);
				setError(
					err instanceof Error
						? err.message
						: "An error occurred while fetching workspaces",
				);
			} finally {
				setLoading(false);
			}
		};

		initiateStore();
	}, [user, userLoading, userError, workspaceUrl]);

	return {
		user,
		loading: userLoading || loading,
		error: userError || error,
		currentWorkspace,
		workspaces,
	};
}
