import { workspaceService } from "@/lib/services";
import { useWorkspaceStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthUser } from "./useAuthUser";

export function useWorkspaces() {
	const { user, loading: userLoading, error: userError } = useAuthUser();
	const { workspace, workspaces, setWorkspace, setWorkspaces } =
		useWorkspaceStore((state) => state);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const params = useParams();
	const workspaceUrl = parseParams(params.workspace);

	useEffect(() => {
		const initiateStore = async () => {
			if (userLoading) return;

			setLoading(true);
			setError(null);

			try {
				if (user && !workspace) {
					const allWorkspaces = await workspaceService.getUserWorkspaces(TODO, {
						userId: user.id,
					});
					setWorkspaces(allWorkspaces);
					setWorkspace(
						allWorkspaces?.find((ws) => ws.url === workspaceUrl) ?? null,
					);
					if (workspaceUrl && !workspace) {
						setError(`Workspace with URL "${workspaceUrl}" not found`);
					}
					setLoading(false);
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
			}
		};

		initiateStore();
	}, [user, userLoading, userError, workspaceUrl]);

	return {
		user,
		loading: userLoading || loading,
		error: userError || error,
		workspace,
		workspaces,
	};
}
