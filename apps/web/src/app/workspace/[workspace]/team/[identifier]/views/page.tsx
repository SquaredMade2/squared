"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getFilteredViews } from "@/store/filterPage/actions";
import type { RootState } from "@/store";
import FilterList from "@/components/FilterList";
import ViewTopNavBar from "@/components/ViewTopNavBar";

const ViewsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const teamId = useSelector(
		(state: RootState) => state.taskData.currentTeam._id,
	);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		dispatch(getFilteredViews(teamId));
	}, [dispatch, teamId]);

	return (
		<div className="flex flex-row w-full overflow-hidden relative">
			<div className="flex flex-col w-full h-screen bg-background relative">
				<div className="w-full px-8 h-screen snap-x relative">
					<div className="bg-background lg:max-w-[calc(100vw-330px)] flex flex-col items-center justify-between">
						<div className="w-full h-[7vh]">
							<ViewTopNavBar setSearchInput={setSearchInput} />
						</div>
					</div>
					<FilterList searchInput={searchInput} />
				</div>
			</div>
		</div>
	);
};

export default ViewsPage;
