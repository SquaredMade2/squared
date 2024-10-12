import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTeamStore } from "@/store";
import { useWorkspaces } from "./useWorkspaces";
import type { Team } from "@repo/db";
import { parseParams } from "@/utils/parseParams";
import { useUsers } from "./useUsers";

export function useTeams() {
	const { currentTeam, getAllTeams, setCurrentTeam } = useTeamStore(
		(state) => state,
	);
	const { loading: workspaceLoading, currentWorkspace, user } = useWorkspaces();
	const { users, loading: userLoading } = useUsers();
	const [loading, setLoading] = useState(true);
	const [teams, setTeams] = useState<Team[]>([]);
	const [authorized, setAuthorized] = useState(false);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);

	useEffect(() => {
		const initiateStore = async () => {
			if (workspaceLoading) return;
			setLoading(true);

			if (user && currentWorkspace) {
				const userHasAccess = users.some((u) => u.id === user.id);
				setAuthorized(userHasAccess);
				if (userHasAccess && currentTeam?.identifier !== teamIdentifier) {
					const allTeams = await getAllTeams(currentWorkspace.id);
					setTeams(allTeams);
					const team = teams.find((t) => t.identifier === teamIdentifier);
					team && setCurrentTeam(team);
				}
			}

			setLoading(false);
		};

		initiateStore();
	}, [currentWorkspace, currentTeam, workspaceLoading, userLoading]);

	return {
		loading,
		currentTeam,
		authorized,
		teams,
	};
}
