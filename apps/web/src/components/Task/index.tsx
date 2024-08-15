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

const styles = {
  pageWrapper:
    " w-full mdlg:w-full flex space-around scrollbar-thin-transparent overflow-auto max850:overflow-x-hidden",

  sideNavWrapper:
    "relative max850:absolute transition-all duration-300 ease-in-out",
  sideNavBackdrop:
    "max850:block hidden w-full h-screen absolute bg-gray-500 z-10 bg-opacity-40",
  navBackdrop:
    "mdsm:block hidden w-full h-screen absolute bg-gray-500 z-10 bg-opacity-40",
};

const Task: React.FC<{ mailTask?: boolean }> = ({ mailTask }) => {
  const [render, setRender] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const task = useAppSelector((state) => state.singleTask.data) || null;
  const isLoading = useAppSelector((state) => state.singleTask.isLoading);
  const currentRepo = useAppSelector(
    (state) => state.taskData.currentWorkspace.githubRepoInfo
  );
  const navbarToggled = useAppSelector(
    (state) => state.userSettings.showNavBar
  );

  const showBackdrop = showSideNav || navbarToggled;
  const dispatch = useAppDispatch();
  const { taskId } = useParams();
  const sideNav = useRef(null);
  const svgRef = useRef(null);

  const currentTaskId = useAppSelector(
    (state) => state.currentTask.currentTaskId
  );
  const dataForDispatch = taskId || currentTaskId;

  const toggleNav = () => {
    setShowSideNav(!showSideNav);
  };

  useEffect(() => {
    if (dataForDispatch) {
      dispatch(getTaskComments(dataForDispatch as string));
      dispatch(getSingleTask(dataForDispatch as string));
      dispatch(getTaskEventLog(dataForDispatch as string));
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
        })
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
          <div className={styles.pageWrapper}>
            {showBackdrop && (
              <div className={showSideNav ? styles.sideNavBackdrop : ""} />
            )}
            <div className="w-full h-full p-2 md:p-5 xl:px-10 ">
              <div className="flex w-full relative">
                <TaskPageCenterContainer
                  setShowSideNav={toggleNav}
                  svgRef={svgRef}
                />
                <div
                  className={`${styles.sideNavWrapper} ${
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
