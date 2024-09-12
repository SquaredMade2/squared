"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import IssueSidebarContainer from "../IssueSidebarContainer";
import TaskPageCenterContainer from "../TaskPageCenterContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { setGetSingleTaskError, removeTaskData } from "@/store/task";
import { ActionType } from "@/store/events/events.actionTypes";
import { getCommitsByRepo } from "@/store/taskData/thunks";
import { LoadingTask } from "../LoadingTask";
import { useToast } from "../ui/use-toast";
import { useTaskStore, useTeamStore, useWorkspaceStore } from "@/storeZ";
import { setTaskList } from "@/store/taskData";

const Task: React.FC<{ mailTask?: boolean }> = ({ mailTask }) => {
	const { tasks, currentTask, getAllTasks, setCurrentTask } = useTaskStore(
		(state) => state,
	);

	const { currentTeam, teams, setCurrentTeam } = useTeamStore((state) => state);

	const currentRepo = useWorkspaceStore(
		(state) => state.currentWorkspace?.githubRepoInfoId,
	);

	const [render, setRender] = useState(false);
	const [showSideNav, setShowSideNav] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

	const navbarToggled = useAppSelector(
		(state) => state.userSettings.showNavBar,
	);

	const showBackdrop = showSideNav || navbarToggled;
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const { taskIdentifier } = useParams();
	const { teamIdentifier } = useParams();
	console.log(teamIdentifier);

	useEffect(() => {
		setIsLoading(true);

		const initializeTaskPage = async () => {
			try {
				if (!currentTeam) {
					const team = teams.find((t) => t.identifier === teamIdentifier);
					if (team) {
						setCurrentTeam(team);
					} else {
						toast({
							title: "Error getting current team",
							description: "Current Team does not exist",
							variant: "destructive",
						});
					}
				}
				if (!currentTask || currentTask.identifier !== taskIdentifier) {
					if (currentTeam) {
						const allTasksFromTeam = await getAllTasks(currentTeam.id);
						setTaskList(allTasksFromTeam);
					}
				}
				const foundTask = tasks.find(
					(eachTask) => eachTask.identifier === taskIdentifier,
				);
				if (foundTask) {
					setCurrentTask(foundTask);
					setCurrentTaskId(foundTask.id);
					setIsLoading(false);
				} else {
					toast({
						title: "Error finding task",
						description: "404 Cannot find task from current team.",
						variant: "destructive",
					});
					setIsLoading(false);
				}
			} catch (err) {
				if (err instanceof Error) {
					toast({
						title: "Error initializating Task Page",
						description: err.message,
						variant: "destructive",
					});
				}
			}
		};
		initializeTaskPage();
	}, []);

	const sideNav = useRef(null);
	const svgRef = useRef(null);

	const dataForDispatch = currentTaskId;

	const toggleNav = () => {
		setShowSideNav(!showSideNav);
	};

	useEffect(() => {
		return () => {
			dispatch(setGetSingleTaskError(false));
			dispatch(removeTaskData());
			dispatch({
				type: ActionType.CLEAR_TASKPAGE_COMMENTS,
				payload: [],
			});
		};
	}, [currentTaskId]);

	useEffect(() => {
		const fetchAsyncTask = async () => {
			// loading state
		};
		if (currentTask !== undefined && isLoading !== true) {
			setRender(true);
		}
	}, [currentTask]);

	useEffect(() => {
		if (currentRepo) {
			dispatch(
				getCommitsByRepo({
					repoName: currentRepo,
					owner: currentRepo,
				}),
			);
		}
	}, []);

	useEffect(() => {
		function handleClickAway(event: MouseEvent) {
			if (
				sideNav.current &&
				!(sideNav.current as HTMLElement).contains(event.target as Node)
			) {
				setShowSideNav(false);
			}
		}

		document.addEventListener("mousedown", handleClickAway);
		return () => {
			document.removeEventListener("mousedown", handleClickAway);
		};
	}, []);

	return (
		<>
			{((!render && !currentTask) || !currentTask) && <LoadingTask />}
			{render && currentTask && (
				<>
					<div className="w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden">
						{showBackdrop && (
							<div
								className={
									showSideNav
										? "max850:block hidden w-full h-screen absolute bg-gray-500 z-10 bg-opacity-40"
										: ""
								}
							/>
						)}
						<div className="w-full h-full p-2 md:p-5 xl:px-10 ">
							<div className="flex w-full relative">
								<TaskPageCenterContainer
									setShowSideNav={toggleNav}
									svgRef={svgRef}
								/>
								<div
									className={`relative max850:absolute transition-all duration-300 ease-in-out ${
										showSideNav
											? " z-20 max850:-right-0 "
											: " max850:-right-[500px] "
									}`}
								>
									<div className="" ref={sideNav}>
										<IssueSidebarContainer currentTask={currentTask}/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Task;
