import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { handleActiveParamsType } from "@/app/interfaces/Navbars.interfaces";
import { Copy, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTeam } from "@/store/taskData/thunks";
import type { NavBarTeamProps } from "./NavBarTeams.interfaces";
import { useTheme } from "next-themes";
import type { Team } from "@repo/db";
import { useTeamStore, useWorkspaceStore } from "@/storeZ";

const NavBarTeams = ({
	onDropdownClick,
	teamIdentifier,
}: NavBarTeamProps): React.ReactElement => {
	const dispatch = useAppDispatch();
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { teams, getAllTeams } = useTeamStore((state) => state);

	useEffect(() => {
		if (!currentWorkspace) return;
		getAllTeams(currentWorkspace.id);
	}, []);
	const router = useRouter();

	const handleActiveParams: handleActiveParamsType = (param: string): void => {
		if (teamIdentifier) {
			router.push(`/${currentWorkspace?.url}/team/${teamIdentifier}/${param}`);
		} else {
			console.error("Team identifier not found");
		}
	};

	const getTeamOnSelect: () => void = () => {
		dispatch(getTeam(teamIdentifier));
	};

	const handleViewsButtonClick: () => void = () => {
		handleActiveParams("views");
		getTeamOnSelect();
	};

	return (
		<div className="w-full z-10">
			<div
				className="w-full flex items-center my-1.5 hover:bg-secondary rounded-md pl-0.5 group"
				onClick={onDropdownClick}
			>
				<button className="flex items-center cursor-pointer" type="button">
					<div className="mr-2 p-0.5 rounded">
						<Copy
							className={"size-4 text-muted-foreground hover:text-accent"}
						/>
					</div>
					<p>Issues</p>
				</button>
			</div>

			<div className="ml-2">
				<div className="w-full border-y-0 border-r-0 border-l border-l-slate-600 pl-2 ml-1.5 my-0.5">
					<div
						className="w-full flex items-center my-1.5 hover:bg-secondary rounded-md pl-0.5"
						onClick={() => handleActiveParams("active")}
					>
						<div>
							<span className="pl-2 cursor-pointer">Active</span>
						</div>
					</div>
					<div
						className="w-full flex items-center my-1.5 hover:bg-secondary rounded-md pl-0.5"
						onClick={() => handleActiveParams("backlog")}
					>
						<div>
							<span className="pl-2 cursor-pointer">Backlog</span>
						</div>
					</div>
				</div>
			</div>

			{/* 
          Commented out broken links until all bugs are fixed and app is launched. Implementing
          these links will take a while. ---> Pinak
          <div className="w-full flex items-center my-1.5 hover:bg-secondary rounded-md pl-0.5 group">
            <Link href={`/projects`}>
            <button className="flex items-center cursor-pointer">
              <div className="mr-2 p-0.5 rounded">
                {<ProjectSquaresSub className="group-hover:fill-white" />}
              </div>
              <p>Projects</p>
            </button>
            </Link>
          </div> 
      */}

			<button className="w-full" onClick={handleViewsButtonClick} type="button">
				<div className="w-full flex items-center my-1.5 hover:bg-secondary rounded-md pl-0.5 group hover:text-foreground text-muted-foreground">
					<div className="flex items-center cursor-pointer">
						<div className="mr-2 p-0.5 rounded">
							<Layers3
								className={"size-4 hover:text-foreground text-muted-foreground"}
							/>
						</div>
						<p>Views</p>
					</div>
				</div>
			</button>
		</div>
	);
};

export default NavBarTeams;
