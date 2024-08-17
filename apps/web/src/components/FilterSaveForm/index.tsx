import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { deleteAllCurrentFilters } from "@/store/filterPage/actions";
import SelectedFilter from "@/components/SelectedFilter";
import type { FilterSaveFormProps } from "./FilterSaveForm.interfaces";
import type { RootState } from "@/store";
import type { CurrentFilters } from "@/store/filterPage";
import { Cpu, LockKeyhole } from "lucide-react";

const FilterSaveForm = ({
	handleFilter,
	handleFilterSaveForm,
	setShowFilterSaveForm,
	redirectToViewsOnCreate = false,
}: FilterSaveFormProps) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [filterTitle, setFilterTitle] = useState<string>("");
	const [filterDescription, setFilterDescription] = useState<string>("");
	const [filterSelected, setFilterSelected] = useState(false);
	const [taskAttributeTitles, setTaskAttributeTitles] = useState<string[]>([]);

	const teamId = useSelector(
		(state: RootState) => state.taskData.currentTeam._id,
	);
	const currentFilters = useSelector(
		(state: RootState) => state.filterPage.currentFilters,
	);
	const workspace = useSelector(
		(state: RootState) => state.taskData.currentWorkspace,
	);
	const team = useSelector((state: RootState) => state.taskData.currentTeam);

	const handleSaveFilter = async () => {
		try {
			await axios({
				url: `${process.env.NEXT_PUBLIC_SERVER}/filter/create`,
				method: "POST",
				data: {
					filterTitle,
					filterOption: currentFilters,
					filterDescription,
					teamId,
				},
			});
			setShowFilterSaveForm(false);
			if (redirectToViewsOnCreate) {
				dispatch(deleteAllCurrentFilters());
				router.push(`/${workspace.url}/team/${team.identifier}/views`);
			}
		} catch (err) {}
	};

	useEffect(() => {
		setTaskAttributeTitles(Object.keys(currentFilters));
		const noFilterSelected =
			currentFilters.status.length === 0 &&
			currentFilters.priority.length === 0 &&
			currentFilters.labels.length === 0 &&
			currentFilters.dueDate.length === 0 &&
			currentFilters.effortEstimate.length === 0;

		if (noFilterSelected) {
			setFilterSelected(false);
		} else {
			setFilterSelected(true);
		}
	}, [currentFilters]);

	return (
		<div className="grid grid-rows-3 h-[20vh] w-full bg-card border border-border">
			<div className="flex items-center bg-card">
				<div id="icon" className="border border-border rounded ml-2 p-0.5">
					<Cpu className="size-5 text-[#BEC2C8]" />
				</div>
				{/* future update: make icon dropdown menu */}
				<div className="ml-2 w-9/12 h-5/6 bg-card">
					<input
						type="text"
						placeholder="Untitled Issue Title"
						className="w-full h-full bg-card caret-slate-400 text-foreground focus-visible:outline-none"
						onChange={(e) => {
							setFilterTitle(e.target.value);
						}}
					/>
				</div>
				<div className="flex items-center ml-20 text-foreground">
					<p className="text-sm">Visibility</p>
					<button
						type="button"
						className="flex cursor-pointer items-center ml-1 p-0.5 text-foreground text-xs border border-border rounded"
					>
						<div className="ml-0.5">
							<LockKeyhole className="size-4 text-[#9b9ba9]" />
						</div>
						<p className="text-foreground ml-1 mr-0.5">Private</p>
					</button>
					{/* future update: make privacy dropdown functional */}
				</div>
			</div>
			<div
				className="flex items-center"
				onChange={(e) => {
					const target = e.target as HTMLInputElement;
					setFilterDescription(target.value);
				}}
			>
				<input
					type="text"
					placeholder="Description (optional)"
					className="w-11/12 text-foreground h-4/6 ml-11 bg-card caret-slate-400 focus-visible:outline-none placeholder:text-xs"
				/>
			</div>
			<div className="grid items-center grid-cols-2 border-t border-border">
				<div className="flex">
					{filterSelected &&
						taskAttributeTitles.map((taskAttributeTitle) => {
							return (
								currentFilters[
									taskAttributeTitle as keyof CurrentFilters
								] as string[]
							).map((taskAttribute) => {
								return (
									<SelectedFilter
										key={taskAttribute}
										taskAttribute={taskAttribute}
										taskAttributeTitle={taskAttributeTitle}
										handleFilter={handleFilter}
									/>
								);
							});
						})}
				</div>
				<div className="flex justify-end">
					<button
						type="button"
						className="rounded bg-card p-0.5 mr-2 cursor-pointer"
						onClick={() => {
							handleFilterSaveForm(false);
							handleFilter(null);
						}}
					>
						<p className="text-foreground">Cancel</p>
					</button>
					<button
						type="button"
						onClick={handleSaveFilter}
						className="rounded border border-secondary bg-background p-0.5 mr-6 cursor-pointer"
					>
						<p className="text-foreground">Create</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FilterSaveForm;
