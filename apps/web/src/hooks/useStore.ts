import {
	useActivityStore,
	useAuthStore,
	useCommentStore,
	useFilterStore,
	useNotificationStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useStore() {
	const { user, setUser } = useAuthStore((state) => state);
	const workspaceStore = useWorkspaceStore((state) => state);
	const taskStore = useTaskStore((state) => state);
	const teamStore = useTeamStore((state) => state);
	const userStore = useUserStore((state) => state);
	const notificationStore = useNotificationStore((state) => state);
	const filterStore = useFilterStore((state) => state);
	const viewStore = useViewStore((state) => state);
	const activityStore = useActivityStore((state) => state);
	const commentStore = useCommentStore((state) => state);
	const router = useRouter();
	const session = useSession();

	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);

	const params = useParams();
	const workspaceUrl = params.workspace;
	const teamIdentifier = Array.isArray(params.identifier)
		? params.identifier[0]
		: params.identifier;

	useEffect(() => {
		const initiateStore = async () => {
			setLoading(true);

			if (user && !workspaceStore.currentWorkspace) {
				const workspaces = await workspaceStore.getAllWorkspaces(user.id);
				const workspace = workspaces?.find((ws) => ws.url === workspaceUrl);
				workspace && workspaceStore.setCurrentWorkspace(workspace);
			}

			if (user && workspaceStore.currentWorkspace) {
				const allUsers = await userStore.getAllUsers(
					workspaceStore.currentWorkspace.id,
				);
				const userHasAccess = allUsers.some((u) => u.id === user.id);
				setAuthorized(userHasAccess);
				if (
					userHasAccess &&
					teamStore.currentTeam?.identifier !== teamIdentifier
				) {
					const teams = await teamStore.getAllTeams(
						workspaceStore.currentWorkspace.id,
					);
					const team = teams.find((t) => t.identifier === teamIdentifier);
					team && teamStore.setCurrentTeam(team);
					if (team) {
						await taskStore.getAllTasks(team.id);
					}
				}
			}

			setLoading(false);
		};

		initiateStore();
	}, [
		workspaceStore.currentWorkspace,
		user,
		workspaceUrl,
		teamStore.currentTeam,
		teamIdentifier,
	]);

	useEffect(() => {
		if (session.status === "unauthenticated") {
			router.push("/");
		}
		if (session.status === "authenticated") {
			const getUser = async () => {
				const newUser = await userStore.getUser(session.data.user.id);
				setUser(newUser.user);
			};
			getUser();
		}
	}, [session]);

	if (
		((!workspaceStore.currentWorkspace || !teamStore.currentTeam) && !user) ||
		!user
	) {
		router.push("/");
	}

	return {
		...taskStore,
		...workspaceStore,
		...teamStore,
		...userStore,
		...notificationStore,
		...filterStore,
		...viewStore,
		...activityStore,
		...commentStore,
		user,
		loading,
		authorized,
	};
}
