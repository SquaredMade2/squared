import { useOrganization } from "@clerk/nextjs";
import { Activity, Copy, Layers3 } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { toast } from "@squaredmade/ui/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTeamStore } from "@/store";

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
	const { organization } = useOrganization();
	const { teams, setTeam } = useTeamStore((state) => state);

	const router = useRouter();

	const handleActiveParams = (param: string): void => {
		if (teamIdentifier) {
			getTeamOnSelect();
			router.push(`/${organization?.slug}/team/${teamIdentifier}/${param}`);
		} else {
			toast.error("Team identifier not found");
		}
	};

	const getTeamOnSelect = () => {
		const team = teams.find((t) => t.identifier === teamIdentifier);
		if (team) {
			setTeam(team);
		}
	};

	const currentTeam = teams.find((team) => team.identifier === teamIdentifier);
	if (!currentTeam) return null;

	return (
		<div className="z-10 my-1 w-full space-y-1 px-1">
			<Button
				className="h-6 w-full justify-start"
				onClick={() => handleActiveParams("all")}
				variant={currentPage === "all" && active ? "secondary" : "ghost"}
			>
				<Copy className="mr-2 size-4 text-muted-foreground" />
				<p>Tasks</p>
			</Button>
			<div className="my-0.5 ml-6 border-border border-l pl-3">
				<Button
					className="h-6 w-full justify-start pr-0 pl-3"
					onClick={() => handleActiveParams("active")}
					variant={currentPage === "active" && active ? "secondary" : "ghost"}
				>
					Active
				</Button>
				<Button
					className="h-6 w-full justify-start pr-0 pl-3"
					onClick={() => handleActiveParams("backlog")}
					variant={currentPage === "backlog" && active ? "secondary" : "ghost"}
				>
					Backlog
				</Button>
			</div>
			{currentTeam.sprintsEnabled && (
				<>
					<Button
						className="h-6 w-full justify-start"
						onClick={() => handleActiveParams("sprints")}
						variant={
							currentPage === "sprints" && active ? "secondary" : "ghost"
						}
					>
						<Activity className="mr-2 size-4 text-muted-foreground" />
						<p>Sprints</p>
					</Button>
					<div className="my-0.5 ml-6 border-border border-l pl-3">
						<Button
							className="h-6 w-full justify-start pr-0 pl-3"
							onClick={() => handleActiveParams("sprints/current")}
							variant={
								currentPage === "current" && active ? "secondary" : "ghost"
							}
						>
							Current Sprint
						</Button>
						<Button
							className="h-6 w-full justify-start pr-0 pl-3"
							onClick={() => handleActiveParams("sprints/upcoming")}
							variant={
								currentPage === "upcoming" && active ? "secondary" : "ghost"
							}
						>
							Upcoming
						</Button>
					</div>
				</>
			)}
			<Link
				className="block"
				href={`/${organization?.slug}/team/${teamIdentifier}/views`}
			>
				<Button
					className="h-6 w-full justify-start"
					onClick={() => handleActiveParams("views")}
					variant={currentPage === "views" && active ? "secondary" : "ghost"}
				>
					<Layers3 className="mr-2 size-4 text-muted-foreground" />
					<p>Views</p>
				</Button>
			</Link>
		</div>
	);
};

export default NavBarTeams;
