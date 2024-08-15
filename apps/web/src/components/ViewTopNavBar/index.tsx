import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { deleteAllCurrentFilters } from "@/store/filterPage/actions";
import { navBarToggle } from "@/store/userSettings";
import type { RootState } from "@/store";
import TopNavBarDisplay from "@/components/TopNavBarDisplay";
import WorkspaceInitials from "@/components/WorkspaceImage";
import type {
	handleNavbarType,
	handleSearchType,
} from "@/app/interfaces/Navbars.interfaces";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import type { ViewTopNavBarProps } from "./ViewTopNavBar.interfaces";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { ChevronRight, PanelLeft, Plus, Search } from "lucide-react";

const ViewTopNavBar = ({ setSearchInput }: ViewTopNavBarProps) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const showNavBar = useSelector(
		(state: RootState) => state.userSettings.showNavBar,
	);
	const allWorkspaces = useSelector(
		(state: RootState) => state.taskData.workspaces,
	);
	const currentWorkspace = useSelector(
		(state: RootState) => state.taskData.currentWorkspace,
	);

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const index: number = allWorkspaces.findIndex(
		(item) => item._id === currentWorkspace._id,
	);

	const handleNavBar: handleNavbarType = () => {
		const navBarValue = !showNavBar;
		dispatch(navBarToggle(navBarValue));
	};

	const handleSearch: handleSearchType = (e: React.SyntheticEvent) => {
		const target = e.target as HTMLInputElement; // Type assertion
		setSearchInput(target.value);
	};

	const handleNewView = (): void => {
		dispatch(deleteAllCurrentFilters());
		router.push(
			`/workspace/${currentWorkspace.url}/team/${currentTeam.identifier}/views/new`,
		);
	};

	return (
		<header>
			<nav className="w-full items-center h-full flex">
				<div className="flex items-center w-3/12 h-full">
					<div
						onClick={() => {
							handleNavBar();
						}}
						className="lg:hidden cursor-pointer z-50 ml-5"
					>
						<PanelLeft className="text-[#6B6F76] size-5" />
					</div>
					<div className="space-x-4 flex items-center">
						<div className="flex flex-row items-center rounded-lg text-foreground">
							<WorkspaceInitials
								workspaceName={currentTeam.name}
								backgroundColor={index}
								location="workspaceMenu"
							/>
							{handleWorkspaceNameOverflow(currentTeam.name)}
						</div>
						<ChevronRight className="size-4 stroke-gray-500" />
						<div className="text-foreground">Views</div>
					</div>
					{/* <button className="ml-2 p-1 bg-card rounded hover:bg-background">{Star()}</button> -- commented out until feature added -Pinak */}
				</div>
				<div className="flex items-center w-9/12 justify-end h-[7vh] space-x-3">
					<div className="flex items-center border border-solid border-border rounded ml-24">
						<div className="m-1">
							<Search className="size-4 text-[#858699]" />
						</div>
						<input
							className="bg-background text-muted-foreground rounded focus-visible:outline-none py-[7px]"
							placeholder="Find a view..."
							onChange={(e) => {
								handleSearch(e);
							}}
						/>
					</div>
					<TopNavBarDisplay />
					<button
						className="bg-card flex items-center border border-solid border-border md:flex md:text-sm hidden hidden rounded m-1 px-3 h-10 py-0.5 text-foreground space-x-2 cursor-pointer hover:bg-accent"
						onClick={handleNewView}
						type="button"
					>
						<Plus className="size-4 text-[#858699]" />
						<p>New View</p>
					</button>
				</div>
			</nav>
		</header>
	);
};

export default ViewTopNavBar;
