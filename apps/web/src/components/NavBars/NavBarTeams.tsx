import { useEffect } from "react";
import { Activity, Copy, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NavBarTeamProps } from "./interfaces";
import { useTaskStore, useTeamStore, useWorkspaceStore } from "@/store";
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
	const { getAllTasks } = useTaskStore((state) => state);
	const { toast } = useToast();

	useEffect(() => {
		if (!currentWorkspace) return;
		getAllTeams(currentWorkspace.id);
	}, []);
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
		<div className="w-full z-10">
			<Button
				variant={currentPage === "all" && active ? "secondary" : "ghost"}
				onClick={() => handleActiveParams("all")}
				className="w-full justify-start h-6"
			>
				<div className="mr-2 p-0.5 rounded">
					<Copy className={"size-4 text-muted-foreground hover:text-accent"} />
				</div>
				<p>Tasks</p>
			</Button>
			<div className="ml-2">
				<div className="w-full border-l border-border pl-2 ml-4 my-0.5">
					<Button
						variant={currentPage === "active" && active ? "secondary" : "ghost"}
						onClick={() => handleActiveParams("active")}
						className="w-full justify-start h-6 pl-3"
					>
						Active
					</Button>
					<Button
						variant={
							currentPage === "backlog" && active ? "secondary" : "ghost"
						}
						onClick={() => handleActiveParams("backlog")}
						className="w-full justify-start h-6 pl-3"
					>
						Backlog
					</Button>
				</div>
			</div>
			{currentTeam.sprintsEnabled && (
				<>
					<Button
						variant={"ghost"}
						onClick={() => handleActiveParams("sprints")}
						className="w-full justify-start h-6"
					>
						<div className="mr-2 p-0.5 rounded">
							<Activity
								className={"size-4 text-muted-foreground hover:text-accent"}
							/>
						</div>
						<p>Sprints</p>
					</Button>
					<div className="ml-2">
						<div className="w-full border-l border-border pl-2 ml-4 my-0.5">
							<Button
								variant={"ghost"}
								onClick={() => handleActiveParams("sprints/current")}
								className="w-full justify-start h-6 pl-3"
							>
								Current Sprint
							</Button>
							<Button
								variant={"ghost"}
								onClick={() => handleActiveParams("sprints/upcoming")}
								className="w-full justify-start h-6 pl-3"
							>
								Upcoming
							</Button>
						</div>
					</div>
				</>
			)}
			<Link href={`/${currentWorkspace?.url}/team/${teamIdentifier}/views`}>
				<Button
					variant={currentPage === "views" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("views")}
					className="w-full justify-start h-6"
				>
					<div className="mr-2 p-0.5 rounded">
						<Layers3
							className={"size-4 hover:text-foreground text-muted-foreground"}
						/>
					</div>
					<p>Views</p>
				</Button>
			</Link>
		</div>
	);
};

export default NavBarTeams;
