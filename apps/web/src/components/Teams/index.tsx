"use client";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { useRouter } from "next/navigation";
import { setCurrentTeam } from "@/store/taskData";
import NavBarTeams from "@/components/NavBarTeams";
import type { Team } from "@/store/taskData/taskData.interfaces";

const Teams = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
	const teams = [] as Team[];
	const handleTeamClick = (team: Team): void => {
		dispatch(setCurrentTeam(team));
		router.push(`/${workspace.url}/team/${team.identifier}/all`);
	};

	return (
		<>
			{teams.map((team: Team) => {
				return (
					<div key={team._id}>
						<NavBarTeams
							id={team._id}
							teamName={team.name}
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
