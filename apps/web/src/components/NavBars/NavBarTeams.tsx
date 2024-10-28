import { useEffect } from "react";
import { Activity, Copy, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NavBarTeamProps } from "./interfaces";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Link from "next/link";

const NavBarTeams = ({
	teamIdentifier,
	currentPage,
	active,
}: NavBarTeamProps) => {
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { teams, getAllTeams, setCurrentTeam } = useTeamStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { getAllTasks } = useTaskStore((state) => state);
	const { toast } = useToast();

	useEffect(() => {
		if (!user) return;
		getAllTeams(user.id);
	}, [user, getAllTeams]);

	const router = useRouter();

	const handleActiveParams = (param: string): void => {
		if (teamIdentifier) {
			getTeamOnSelect();
			router.push(`/${currentWorkspace?.url}/team/${teamIdentifier}/${param}`);
		} else {
			toast({ title: "Team identifier not found", variant: "destructive" });
		}
	};

	const getTeamOnSelect = async () => {
		const team = teams.find((team) => team.identifier === teamIdentifier);
		if (team) {
			setCurrentTeam(team);
			await getAllTasks(team.id);
		}
	};

	const currentTeam = teams.find((team) => team.identifier === teamIdentifier);
	if (!currentTeam) return null;

	return (
		<div className="w-full z-10 space-y-1 my-1 px-1">
			<Button
				variant={currentPage === "all" && active ? "secondary" : "ghost"}
				onClick={() => handleActiveParams("all")}
				className="w-full justify-start h-6"
			>
				<Copy className="mr-2 size-4 text-muted-foreground" />
				<p>Tasks</p>
			</Button>
			<div className="border-l border-border pl-2 ml-4 my-0.5">
				<Button
					variant={currentPage === "active" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("active")}
					className="w-full justify-start h-6 pl-3 pr-0"
				>
					Active
				</Button>
				<Button
					variant={currentPage === "backlog" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("backlog")}
					className="w-full justify-start h-6 pl-3 pr-0"
				>
					Backlog
				</Button>
			</div>
			{currentTeam.sprintsEnabled && (
				<>
					<Button
						variant={
							currentPage === "sprints" && active ? "secondary" : "ghost"
						}
						onClick={() => handleActiveParams("sprints")}
						className="w-full justify-start h-6"
					>
						<Activity className="mr-2 size-4 text-muted-foreground" />
						<p>Sprints</p>
					</Button>
					<div className="border-l border-border pl-2 ml-4 my-0.5">
						<Button
							variant={
								currentPage === "current" && active ? "secondary" : "ghost"
							}
							onClick={() => handleActiveParams("sprints/current")}
							className="w-full justify-start h-6 pl-3 pr-0"
						>
							Current Sprint
						</Button>
						<Button
							variant={
								currentPage === "upcoming" && active ? "secondary" : "ghost"
							}
							onClick={() => handleActiveParams("sprints/upcoming")}
							className="w-full justify-start h-6 pl-3 pr-0"
						>
							Upcoming
						</Button>
					</div>
				</>
			)}
			<Link
				href={`/${currentWorkspace?.url}/team/${teamIdentifier}/views`}
				className="block"
			>
				<Button
					variant={currentPage === "views" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("views")}
					className="w-full justify-start h-6"
				>
					<Layers3 className="mr-2 size-4 text-muted-foreground" />
					<p>Views</p>
				</Button>
			</Link>
		</div>
	);
};

export default NavBarTeams;
