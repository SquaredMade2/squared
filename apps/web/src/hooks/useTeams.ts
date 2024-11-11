import { teamService } from "@/lib/services";
import { useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsers } from "./useUsers";
import { useWorkspaces } from "./useWorkspaces";

export function useTeams() {
	const { team, teams, setTeam, setTeams } = useTeamStore((state) => state);
	const { loading: workspaceLoading, currentWorkspace, user } = useWorkspaces();
	const { users, loading: userLoading } = useUsers();
	const [loading, setLoading] = useState(true);
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
				if (userHasAccess && team?.identifier !== teamIdentifier) {
					const allTeams = await teamService.getUserTeams(TODO, {
						userId: user.id,
						workspaceId: currentWorkspace.id,
					});
					setTeams(allTeams);
					const team = allTeams.find((t) => t.identifier === teamIdentifier);
					team && setTeam(team);
				}
			}

			setLoading(false);
		};

		initiateStore();
	}, [currentWorkspace, teamIdentifier, workspaceLoading, userLoading]);

	return {
		loading,
		team,
		authorized,
		teams,
	};
}
