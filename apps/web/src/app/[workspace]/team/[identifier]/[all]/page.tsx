"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { deleteTaskCard, updateTaskAfterDrag } from "@/api/taskApi";
import { getTeam, getAllTasks } from "@/store/taskData/thunks";
import { setTaskList } from "@/store/taskData";
import TopNavBar from "@/components/TopNavBar";
import ViewAllTasks from "@/components/ViewAllTasks";
import SelectedFiltersBar from "@/components/SelectedFiltersBar/index";
import FilterSaveForm from "@/components/FilterSaveForm";
import { navBarToggle } from "@/store/userSettings";
import type { RootState } from "@/store";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { FilterOption } from "@/app/interfaces/Filter.interfaces";

export default function Home() {
	const dispatch = useDispatch();
	const router = useRouter();
	const params = useParams();
	const { theme, view, user, showNavBar } = useSelector(
		(state: RootState) => state.userSettings,
	);

	const workSpaceError = useSelector(
		(state: RootState) => state.taskData.error,
	);
	const { currentTeam, access, currentWorkspace } = useSelector(
		(state: RootState) => state.taskData,
	);

	const taskList = useSelector((state: RootState) => state.taskData.taskList);
	const [isLoading] = useState(false);
	const [filterOption, setFilterOption] = useState<FilterOption | null>(null);
	const [showFilterSaveForm, setShowFilterSaveForm] = useState(false);
	const workspaceUrl = params.workspace;
	const teamIdentifier = params.identifier;
	const userHasAccess =
		access && access.id === user?._id && workspaceUrl === currentWorkspace.url;
	const navbarRef = useRef(null);

	const handleFilter = (filterValue: FilterOption | null) => {
		setFilterOption(filterValue);
	};

	const handleFilterSaveForm = (value: boolean) => {
		setShowFilterSaveForm(value);
	};

	useEffect(() => {
		if (userHasAccess) {
			dispatch(getTeam(teamIdentifier as string) as never);
		} else {
			router.push(`/${workspaceUrl}`);
		}
	}, [dispatch, teamIdentifier, userHasAccess, workspaceUrl, router]);

	const activeSelected = params.all === "active";
	const backlogSelected = params.all === "backlog";

	const handleDeleteTask = async (taskId: string) => {
		await deleteTaskCard(taskId);
		dispatch(getAllTasks(currentTeam) as never);
	};

	const handleDragEnd: OnDragEndResponder = async (result) => {
		const { destination, source, draggableId } = result;

		const destinationUnchanged =
			destination?.droppableId === source.droppableId;

		if (!destination || destinationUnchanged) {
			return;
		}

		const draggedTaskFound = taskList.find(
			(task) => task && task._id === draggableId,
		);

		if (!draggedTaskFound) {
			return;
		}

		const taskWithNewStatus = {
			...draggedTaskFound,
			status: destination.droppableId,
		};

		const sourceIndex = taskList.findIndex(
			(task) => task && task._id === draggableId,
		);
		const destinationIndex = taskList.findIndex(
			(task) => task && task._id === draggableId,
		);

		const updatedTaskList = [...taskList];
		updatedTaskList.splice(sourceIndex, 1);
		updatedTaskList.splice(destinationIndex, 0, taskWithNewStatus);

		const droppableId = destination.droppableId;

		dispatch(setTaskList(updatedTaskList));
		await updateTaskAfterDrag(draggedTaskFound, droppableId);
	};

	useEffect(() => {
		function handleClickAway(event: MouseEvent) {
			if (
				navbarRef.current &&
				event.target &&
				(navbarRef.current as HTMLElement).contains(event.target as Node)
			) {
				dispatch(navBarToggle(false));
			}
		}

		document.addEventListener("mousedown", handleClickAway);
		return () => {
			document.removeEventListener("mousedown", handleClickAway);
		};
	}, [dispatch]);

	return (
		<>
			{!isLoading && !workSpaceError && (
				<div
					className={`flex flex-row relative lg:w-[calc(100%-296px)] ${view === "grid" && theme === "light" ? "bg-background" : "bg-card"} ${theme}`}
				>
					<div className="flex items-center flex-col w-screen h-full bg-background">
						<div
							className={`w-full snap-x overflow-hidden relative ${view === "grid" ? "h-[calc(100vh)]" : "h-[calc(100vh)]"}`}
						>
							<div className="bg-background lg:w-[calc(100vw-296px)] flex flex-col items-center justify-between">
								{!showFilterSaveForm && (
									<div className="w-full px-2 sm:px-5">
										<TopNavBar
											showNavBar={showNavBar}
											handleFilter={handleFilter}
											filterOption={filterOption}
											showFilterSaveForm={showFilterSaveForm}
											handleFilterSaveForm={handleFilterSaveForm}
										/>
									</div>
								)}

								{showFilterSaveForm && (
									<div className="w-[98%] m-3">
										<FilterSaveForm
											filterOption={filterOption}
											handleFilter={handleFilter}
											handleFilterSaveForm={handleFilterSaveForm}
											setShowFilterSaveForm={setShowFilterSaveForm}
										/>
									</div>
								)}
							</div>

							<ViewAllTasks
								activeSelected={activeSelected}
								backlogSelected={backlogSelected}
								handleDragEnd={handleDragEnd}
								handleDeleteTask={handleDeleteTask}
							/>
						</div>
					</div>
				</div>
			)}

			{workSpaceError && (
				<div
					className={`flex flex-row relative lg:w-[calc(100%-296px)] ${view === "grid" && theme === "light" ? "bg-background" : "bg-card"} ${theme}`}
				>
					<div
						className={`h-screen lg:left-0 lg:relative z-40 transition-all duration-300 ease-in-out ${showNavBar ? "absolute -left-full" : "absolute left-0"}`}
					>
						{/* <Navbar /> */}
					</div>

					<div className="flex items-center flex-col w-screen h-full bg-background">
						<div className="bg-background lg:w-[calc(100vw-296px)] flex flex-col items-center justify-between">
							{!showFilterSaveForm && (
								<div className="w-full px-2 sm:px-5">
									<TopNavBar
										handleFilter={handleFilter}
										filterOption={filterOption}
										showFilterSaveForm={showFilterSaveForm}
										handleFilterSaveForm={handleFilterSaveForm}
										showNavBar={showNavBar}
									/>
								</div>
							)}

							{filterOption && !showFilterSaveForm && (
								<div className="w-full">
									<SelectedFiltersBar
										showFilterSaveForm={showFilterSaveForm}
										filterOption={filterOption}
										handleFilter={handleFilter}
										handleFilterSaveForm={handleFilterSaveForm}
									/>
								</div>
							)}
							{showFilterSaveForm && (
								<div className="w-[98%] m-3">
									<FilterSaveForm
										filterOption={filterOption}
										setShowFilterSaveForm={setShowFilterSaveForm}
										handleFilter={handleFilter}
										handleFilterSaveForm={handleFilterSaveForm}
									/>
								</div>
							)}
						</div>
						<div className="w-full h-full flex flex-col items-center justify-center text-foreground">
							<h1 className="text-2xl">Team not found</h1>
							<p>There is no team with identifier {`"${teamIdentifier}"`}</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
