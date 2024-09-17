import type React from "react";
import { useEffect } from "react";
import { Copy, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NavBarTeamProps } from "./NavBarTeams.interfaces";
import { useTaskStore, useTeamStore, useWorkspaceStore } from "@/store";
import { Button } from "../ui/button";

const NavBarTeams = ({
	teamIdentifier,
}: NavBarTeamProps): React.ReactElement => {
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { teams, getAllTeams, getTeam, setCurrentTeam } = useTeamStore(
		(state) => state,
	);
	const { getAllTasks } = useTaskStore((state) => state);

	useEffect(() => {
		if (!currentWorkspace) return;
		getAllTeams(currentWorkspace.id);
	}, []);
	const router = useRouter();

	const handleActiveParams = (param: string): void => {
		if (teamIdentifier) {
			router.push(`/${currentWorkspace?.url}/team/${teamIdentifier}/${param}`);
		} else {
			console.error("Team identifier not found");
		}
	};

	const getTeamOnSelect = async () => {
		const team = teams.find((team) => team.identifier === teamIdentifier);
		if (team) {
			const newTeam = await getTeam(team.id);
			if (newTeam.team) {
				setCurrentTeam(newTeam.team);
				await getAllTasks(newTeam.team.id);
			}
		}
	};

	const handleViewsButtonClick: () => void = () => {
		getTeamOnSelect();
		handleActiveParams("views");
	};

	return (
		<div className="w-full z-10">
			<Button
				variant={"ghost"}
				onClick={() => handleActiveParams("all")}
				className="w-full justify-start h-6"
			>
				<div className="mr-2 p-0.5 rounded">
					<Copy className={"size-4 text-muted-foreground hover:text-accent"} />
				</div>
				<p>Issues</p>
			</Button>
			<div className="ml-2">
				<div className="w-full border-l border-border pl-2 ml-4 my-0.5">
					{/* NOTE: Functionality broken till @napqueenkaila's PRs are merged */}
					<Button
						variant={"ghost"}
						onClick={() => handleActiveParams("active")}
						className="w-full justify-start h-6 pl-3"
					>
						Active
					</Button>
					{/* NOTE: Functionality broken till @napqueenkaila's PRs are merged */}
					<Button
						variant={"ghost"}
						onClick={() => handleActiveParams("backlog")}
						className="w-full justify-start h-6 pl-3"
					>
						Backlog
					</Button>
				</div>
			</div>
			<Button
				variant={"ghost"}
				onClick={handleViewsButtonClick}
				className="w-full justify-start h-6"
			>
				<div className="mr-2 p-0.5 rounded">
					<Layers3
						className={"size-4 hover:text-foreground text-muted-foreground"}
					/>
				</div>
				<p>Views</p>
			</Button>
		</div>
	);
};

export default NavBarTeams;
