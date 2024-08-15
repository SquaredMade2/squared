import { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import type { SetFilter } from "@/app/interfaces/ProjectDataWidget.interfaces";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import ProfileImage from "../../ProfileImage";
import { setCurrentFilter } from "@/store/filterPage/actions";
import WidgetAssigneeDropdown from "../../WidgetAssigneeDropdown";
import type { AssigneesTabProps } from "./AssigneesTab.interfaces";
import { Plus, UserSearch } from "lucide-react";

export const AssigneesTab = ({
	assigneesData,
}: AssigneesTabProps): React.ReactElement => {
	const dispatch = useAppDispatch();
	const lightSettings = useAppSelector((state) => state.userSettings).theme;
	const currentAssigneeFilters = useAppSelector(
		(state) => state.filterPage.currentFilters,
	).assignee;

	const [toggleDropdown, setToggleDropdown] = useState(true);

	const setFilter: SetFilter = (filterAssignee) => {
		if (filterAssignee) {
			const filterReq = {
				id: 1,
				name: filterAssignee,
				border: false,
				svg: (
					<ProfileImage
						profileName={filterAssignee}
						location={"assigneeDropdown"}
					/>
				),
				group: "assignee",
			};
			dispatch(setCurrentFilter(filterReq));
		} else {
			const filterReq = {
				id: 0,
				name: "none",
				border: false,
				svg: <UserSearch className="size-5 text-[#9597AD]" />,
				group: "assignee",
			};
			dispatch(setCurrentFilter(filterReq));
		}
	};

	return (
		<ClickAwayListener onClickAway={() => setToggleDropdown(false)}>
			<div className="flex flex-col items-center mt-10 m-5 w-full max-h-80">
				<label
					className={`mr-auto mr-2 my-2 font-light text-lg ${lightSettings === "dark" ? "text-muted-foreground" : ""} h-8`}
				>
					Assignees
				</label>
				<div className="flex flex-row w-full items-center justify-end overflow-x-scroll">
					<button
						className={`flex flex-row items-center w-full h-12 border border-border bg-textField px-4 rounded-xl border outline-none ${lightSettings === "dark" ? (toggleDropdown ? "border-slate-100" : "border-slate-600") : ""} cursor-pointer`}
						onClick={() => setToggleDropdown(!toggleDropdown)}
						type="button"
					>
						<ul className="flex flex-row w-60 overflow-scroll">
							{currentAssigneeFilters?.map((assignee) => (
								<li
									className="flex h-1/2 flex-row justify-center items-center text-nowrap mx-1"
									key={assignee}
								>
									{assignee === null ? (
										<UserSearch className="size-5 text-[#9597AD]" />
									) : (
										<ProfileImage
											profileName={assignee}
											location={"assigneeDropdown"}
										/>
									)}
								</li>
							))}
						</ul>
					</button>
					<div className="absolute m-5">
						<Plus className="size-5 cursor-pointer" />
					</div>
				</div>
				<div
					className={`absolute bg-card z-30 mt-24 flex flex-col ${toggleDropdown ? "" : "hidden"} border border-slate-600 w-5/6 h-auto max-h-60 rounded-lg p-3 overflow-y-auto`}
				>
					{Object.entries(assigneesData).map((assignee) => (
						<div key={assignee[0]}>
							<WidgetAssigneeDropdown
								assignee={assignee}
								setFilter={setFilter}
							/>
						</div>
					))}
				</div>
			</div>
		</ClickAwayListener>
	);
};
