import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore, useWorkspaceStore } from "@/store";
import type { Workspace } from "@/store/workspaces";
import { parseParams } from "@/utils/parseParams";

export function useWorkspaces() {
	const { user } = useAuthStore((state) => state);
	const { currentWorkspace, getAllWorkspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const [loading, setLoading] = useState(true);
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

	const params = useParams();
	const workspaceUrl = parseParams(params.workspace);

	useEffect(() => {
		const initiateStore = async () => {
			setLoading(true);

			if (user && !currentWorkspace) {
				const allWorkspaces = await getAllWorkspaces(user.id);
				setWorkspaces(allWorkspaces);
				const workspace = workspaces?.find((ws) => ws.url === workspaceUrl);
				workspace && setCurrentWorkspace(workspace);
			}

			setLoading(false);
		};

		initiateStore();
	}, [currentWorkspace, user, workspaceUrl]);

	return {
		user,
		loading,
		currentWorkspace,
		workspaces,
	};
}
