"use client";

import { useEffect, useState, useRef } from "react";
import MailTask from "../MailTask";
import DefaultTask from "../DefaultTask";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { setGetSingleTaskError, removeTaskData } from "@/store/task";
import type { SingleTaskDataInterface } from "@/store/task";
import { getTaskComments, getTaskEventLog } from "@/store/events/actions";
import { ActionType } from "@/store/events/events.actionTypes";
import { getCommitsByRepo } from "@/store/taskData/thunks";
import { useToast } from "../ui/use-toast";
import { useSquaredStore } from "@/storeZ/provider";
import type { Task as TaskType } from "@repo/db";

const Task: React.FC<{ mailTask?: boolean }> = ({ mailTask }) => {
	const [render, setRender] = useState(false);
	const [showSideNav, setShowSideNav] = useState(false);
	const { getTask } = useSquaredStore((state) => state.tasks);
	const task = useAppSelector((state) => state.singleTask.data) || null;
	const isLoading = useAppSelector((state) => state.singleTask.isLoading);
	const currentRepo = useAppSelector(
		(state) => state.taskData.currentWorkspace.githubRepoInfo,
	);
	const navbarToggled = useAppSelector(
		(state) => state.userSettings.showNavBar,
	);
	const taskList = useAppSelector((state) => state.taskData.taskList);
	const taskPageId: TaskType["id"] | null = useAppSelector(
		(state) => state.taskData.taskPage._id,
	);
	const showBackdrop = showSideNav || navbarToggled;
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const { taskName } = useParams();

	const sideNav = useRef(null);
	const svgRef = useRef(null);

	const currentTaskId: TaskType["id"] | null = useAppSelector(
		(state) => state.currentTask.currentTaskId,
	);
	const taskId: TaskType["id"] | undefined = taskList.find(
		(el) =>
			el.title.trim().split(" ").join("-").toLocaleLowerCase() === taskName,
	)?._id;

	const dataForDispatch: TaskType["id"] | null =
		taskId || taskPageId || currentTaskId;

	const toggleNav = () => {
		setShowSideNav(!showSideNav);
	};

	useEffect(() => {
		if (dataForDispatch) {
			try {
				dispatch(getTaskComments(dataForDispatch as string));
				async () => await getTask(dataForDispatch as string);
				dispatch(getTaskEventLog(dataForDispatch as string));
			} catch (error) {
				toast({
					title: "An unexpected error occured",
					variant: "destructive",
				});
			}
		}
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
		if (task !== undefined && isLoading !== true) {
			setRender(true);
		}
	}, [task]);

	useEffect(() => {
		if (currentRepo) {
			dispatch(
				getCommitsByRepo({
					repoName: currentRepo.repoName,
					owner: currentRepo.owner,
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
			{!mailTask && (
				<DefaultTask
					task={task as SingleTaskDataInterface}
					render={render}
					showBackdrop={showBackdrop}
					showSideNav={showSideNav}
					toggleSideNav={toggleNav}
					svgRef={svgRef}
					sideNav={sideNav}
				/>
			)}
			{mailTask && (
				<MailTask
					task={task as SingleTaskDataInterface}
					render={render}
					showBackdrop={showBackdrop}
					showSideNav={showSideNav}
					toggleSideNav={toggleNav}
					sideNav={sideNav}
				/>
			)}
		</>
	);
};

export default Task;
