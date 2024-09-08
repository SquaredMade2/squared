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
import { Button } from "../ui/button";

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

	const handleSearch: handleSearchType = (e: React.SyntheticEvent) => {
		const target = e.target as HTMLInputElement; // Type assertion
		setSearchInput(target.value);
	};

	const handleNewView = (): void => {
		dispatch(deleteAllCurrentFilters());
		router.push(
			`/${currentWorkspace.url}/team/${currentTeam.identifier}/views/new`,
		);
	};

	return (
		<header>
			<nav className="w-full items-center h-full flex">
				<div className="flex items-center w-3/12 h-full">
					<div className="text-foreground">Views</div>
				</div>
				<div className="flex items-center w-9/12 justify-end h-[7vh] space-x-3">
					<TopNavBarDisplay />

					<Button
						className="gap-2"
						onClick={handleNewView}
						type="button"
						variant={"outline"}
					>
						<Plus className="size-4" />
						<p>New View</p>
					</Button>
				</div>
			</nav>
		</header>
	);
};

export default ViewTopNavBar;
