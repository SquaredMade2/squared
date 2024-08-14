"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import IssueSidebarContainer from "@/components/IssueSidebarContainer";
import { setGetSingleTaskError, removeTaskData } from "@/store/task";
import { getSingleTaskIdentifier } from "@/store/task/thunks";
import {
  getTaskComments,
  getTaskEventLog,
  clearTaskEventLog,
} from "@/store/events/actions";
import { ActionType } from "@/store/events/events.actionTypes";
import IssueSidebarTopRow from "@/components/IssueSidebarTopRow";
import { formatUrl } from "@/utils/formatting";
import TaskPageCenterContainer from "@/components/TaskPageCenterContainer";
import { LoadingTask } from "@/components/LoadingTask";

const TaskPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [render, setRender] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const taskId = useAppSelector((state) => state.singleTask.data?._id);
  const { taskPage, access, currentWorkspace } = useAppSelector(
    (state) => state.taskData
  );
  const { user } = useAppSelector((state) => state.userSettings);
  const isLoading = useAppSelector((state) => state.singleTask.isLoading);
  const isError = useAppSelector((state) => state.singleTask.isLoading);
  const navBarRef = useRef(null);
  const sideNav = useRef(null);
  const svgRef = useRef(null);
  const workspaceUrl = params.workspace;
  const userHasAccess =
    access && access.id === user?._id && workspaceUrl === currentWorkspace.url;
  const urlRedirect = `/${workspaceUrl}/issue/${params.identifier}/${formatUrl(taskPage.title)}`;

  const toggleNav = (nav: string) => {
    if (nav === "navBar") {
      setShowNavBar(!showNavBar);
    } else {
      setShowSideNav(!showSideNav);
    }
  };

  const toggleSideNav = () => toggleNav("sideNav");

  const resetTaskEventLog = () => {
    const clearedTaskEventLog = {
      taskId: "",
      author: {
        id: "",
        name: "",
      },
      createdAt: null,
      eventsLog: [],
      _id: "",
    };
    dispatch(clearTaskEventLog(clearedTaskEventLog));
  };

  useEffect(() => {
    dispatch(getTaskComments(taskPage._id));
    dispatch(getTaskEventLog(taskPage._id));

    const fetch = async () => {
      const taskTitle = await dispatch(
        getSingleTaskIdentifier({
          identifier: params.identifier as string,
          workspace: params.workspace as string,
        })
      );
      if (taskTitle) {
        if (
          formatUrl(params.issue as string) !==
          formatUrl(taskTitle.payload.title)
        ) {
          router.push(urlRedirect);
        }
      }
    };
    fetch();

    return () => {
      dispatch(setGetSingleTaskError(false));
      dispatch(removeTaskData());
      dispatch({
        type: ActionType.CLEAR_TASKPAGE_COMMENTS,
        payload: [],
      });
      resetTaskEventLog();
    };
  }, []);

  useEffect(() => {
    if (!userHasAccess) {
      router.push(`/workspace/${workspaceUrl}`);
    }
    if (taskId !== undefined && isLoading !== true) {
      setRender(true);
    } else {
      setRender(false);
    }
  }, [taskId, workspaceUrl, params]);

  useEffect(() => {
    function handleClickAway(event: MouseEvent) {
      if (
        svgRef.current &&
        (svgRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowNavBar(false);
        return;
      }

      if (
        navBarRef.current &&
        !(navBarRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowNavBar(false);
      }

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
    <div className="w-screen h-screen flex bg-background overflow-hidden">
      {!render && isError && <LoadingTask />}
      {!render && isLoading && <LoadingTask />}
      {render && taskId && (
        <div className="min-h-screen w-full flex justify-center overflow-auto">
          <div className="flex flex-col w-[calc(100%-96px)] xs:w-[calc(100%-24px)]">
            <div className="flex flex-col">
              <TaskPageCenterContainer
                setShowSideNav={toggleSideNav}
                svgRef={svgRef}
              />
              <div className="relative mdsm:absolute -right-0 transition-all duration-300 ease-in-out z-40">
                <IssueSidebarTopRow />
                <div
                  ref={sideNav}
                  className={`relative mdsm:absolute -right-0 transition-all duration-300 ease-in-out z-40 ${
                    showSideNav
                      ? "mdsm:-right-0 mdsm:top-20"
                      : "mdsm:-right-[500px] mdsm:top-20"
                  }`}
                >
                  <IssueSidebarContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
