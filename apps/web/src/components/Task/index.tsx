"use client";
import IssueSidebarContainer from "../IssueSidebarContainer";
import TaskPageCenterContainer from "../TaskPageCenterContainer";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { setGetSingleTaskError, removeTaskData } from "@/store/task";
import { getSingleTask } from "@/store/task/thunks";
import { getTaskComments, getTaskEventLog } from "@/store/events/actions";
import { ActionType } from "@/store/events/events.actionTypes";
import { getCommitsByRepo } from "@/store/taskData/thunks";
import { LoadingTask } from "../LoadingTask";
import { useToast } from "../ui/use-toast";
import { formatUrl } from "@/utils/formatting";
import { useTaskStore, useTeamStore } from "@/storeZ";
import { setTaskList } from "@/store/taskData";

const Task: React.FC<{ mailTask?: boolean }> = ({ mailTask }) => {
	const { tasks, currentTask, getAllTasks, setCurrentTask } = useTaskStore(
		(state) => state,
	);
	const { currentTeam, getTeam, setCurrentTeam } = useTeamStore(
		(state) => state,
	);

	const [render, setRender] = useState(false);
	const [showSideNav, setShowSideNav] = useState(false);
	const [task, setTask] = useState(currentTask);
	const [loading, setLoading] = useState(true);
	const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

	const isLoading = useAppSelector((state) => state.singleTask.isLoading);
	const currentRepo = useAppSelector(
		(state) => state.taskData.currentWorkspace.githubRepoInfoId,
	);
	const navbarToggled = useAppSelector(
		(state) => state.userSettings.showNavBar,
	);
	const taskList = useAppSelector((state) => state.taskData.taskList);
	const taskPageId = useAppSelector((state) => state.taskData.taskPage.id);
	const showBackdrop = showSideNav || navbarToggled;
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const { taskIdentifier } = useParams();

	useEffect(() => {
		setLoading(true);

		const initializeTaskPage = async () => {
			try {
				if (!currentTeam) {
					console.error("Current Team does not exist");
					toast({
						title: "Error getting current team",
						description: "Current Team does not exist",
						variant: "destructive",
					});
					setLoading(false);
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
					setTask(foundTask);
					setLoading(false);
				} else {
					console.error("404 Cannot find task from current team.");
					toast({
						title: "Error finding task",
						description: "404 Cannot find task from current team.",
						variant: "destructive",
					});
					setLoading(false);
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

	const dataForDispatch = taskPageId || currentTaskId;

	const toggleNav = () => {
		setShowSideNav(!showSideNav);
	};

	useEffect(() => {
		// if (dataForDispatch) {
		// 	try {
		// 		dispatch(getTaskComments(dataForDispatch as string));
		// 		dispatch(getSingleTask(dataForDispatch as string));
		// 		dispatch(getTaskEventLog(dataForDispatch as string));
		// 	} catch (error) {
		// 		toast({
		// 			title: "An unexpected error occured",
		// 			variant: "destructive",
		// 		});
		// 	}
		// }
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
		if (task !== undefined && isLoading !== true) {
			setRender(true);
		}
	}, [task]);

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
			{((!render && !task) || !task) && <LoadingTask />}
			{render && task && (
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
										<IssueSidebarContainer />
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
