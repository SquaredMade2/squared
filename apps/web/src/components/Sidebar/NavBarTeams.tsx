import { taskService } from "@/lib/services";
import { useTaskStore, useTeamStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { Copy, Layers3 } from "@squared/icons";
import { Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface NavBarTeamProps {
	teamIdentifier: string;
	currentPage: string;
	active: boolean;
}

const NavBarTeams = ({
	teamIdentifier,
	currentPage,
	active,
}: NavBarTeamProps) => {
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { teams, setTeam } = useTeamStore((state) => state);
	const { setTasks } = useTaskStore((state) => state);
	const { toast } = useToast();

	const router = useRouter();

	const handleActiveParams = (param: string): void => {
		if (teamIdentifier) {
			getTeamOnSelect();
			router.push(`/${workspace?.url}/team/${teamIdentifier}/${param}`);
		} else {
			toast({ title: "Team identifier not found", variant: "destructive" });
		}
	};

	const getTeamOnSelect = async () => {
		const team = teams.find((team) => team.identifier === teamIdentifier);
		if (team) {
			setTeam(team);
			setTasks(await taskService.getTeamTasks(TODO, { teamId: team.id }));
		}
	};

	const currentTeam = teams.find((team) => team.identifier === teamIdentifier);
	if (!currentTeam) return null;

	return (
		<div className="z-10 my-1 w-full space-y-1 px-1">
			<Button
				variant={currentPage === "all" && active ? "secondary" : "ghost"}
				onClick={() => handleActiveParams("all")}
				className="h-6 w-full justify-start"
			>
				<Copy className="mr-2 size-4 text-muted-foreground" />
				<p>Tasks</p>
			</Button>
			<div className="my-0.5 ml-4 border-border border-l pl-2">
				<Button
					variant={currentPage === "active" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("active")}
					className="h-6 w-full justify-start pr-0 pl-3"
				>
					Active
				</Button>
				<Button
					variant={currentPage === "backlog" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("backlog")}
					className="h-6 w-full justify-start pr-0 pl-3"
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
						className="h-6 w-full justify-start"
					>
						<Activity className="mr-2 size-4 text-muted-foreground" />
						<p>Sprints</p>
					</Button>
					<div className="my-0.5 ml-4 border-border border-l pl-2">
						<Button
							variant={
								currentPage === "current" && active ? "secondary" : "ghost"
							}
							onClick={() => handleActiveParams("sprints/current")}
							className="h-6 w-full justify-start pr-0 pl-3"
						>
							Current Sprint
						</Button>
						<Button
							variant={
								currentPage === "upcoming" && active ? "secondary" : "ghost"
							}
							onClick={() => handleActiveParams("sprints/upcoming")}
							className="h-6 w-full justify-start pr-0 pl-3"
						>
							Upcoming
						</Button>
					</div>
				</>
			)}
			<Link
				href={`/${workspace?.url}/team/${teamIdentifier}/views`}
				className="block"
			>
				<Button
					variant={currentPage === "views" && active ? "secondary" : "ghost"}
					onClick={() => handleActiveParams("views")}
					className="h-6 w-full justify-start"
				>
					<Layers3 className="mr-2 size-4 text-muted-foreground" />
					<p>Views</p>
				</Button>
			</Link>
		</div>
	);
};

export default NavBarTeams;
