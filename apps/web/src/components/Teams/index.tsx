"use client";
import { useRouter } from "next/navigation";
import NavBarTeams from "@/components/NavBarTeams";
import type { Team } from "@repo/db";
import { useTeamStore, useWorkspaceStore } from "@/store";

const Teams = () => {
	const router = useRouter();
	const workspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { teams, setCurrentTeam } = useTeamStore((state) => state);
	const handleTeamClick = (team: Team): void => {
		setCurrentTeam(team);
		router.push(`/${workspace?.url}/team/${team.identifier}/all`);
	};

	return (
		<>
			{teams.map((team: Team) => {
				return (
					<div key={team.id}>
						<NavBarTeams
							onDropdownClick={() => handleTeamClick(team)}
							teamIdentifier={team.identifier}
						/>
					</div>
				);
			})}
		</>
	);
};

export default Teams;
