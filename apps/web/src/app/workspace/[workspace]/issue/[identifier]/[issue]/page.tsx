'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import IssueSidebarContainer from '@/components/IssueSidebarContainer';
import { setGetSingleTaskError, removeTaskData } from '@/store/task';
import { getSingleTaskIdentifier } from '@/store/task/thunks';
import { getTaskComments, getTaskEventLog, clearTaskEventLog } from '@/store/events/actions';
import { ActionType } from '@/store/events/events.actionTypes';
import IssueSidebarTopRow from '@/components/IssueSidebarTopRow';
import { formatUrl } from '@/utils/formatting';
import TaskPageCenterContainer from '@/components/TaskPageCenterContainer';
import { LoadingTask } from '@/components/LoadingTask';
const styles = {
  pageContainer: 'w-screen h-screen flex bg-background overflow-hidden',
  pageWrapper: 'min-h-screen w-full flex justify-center overflow-auto',
  centerContainer: 'flex flex-col w-[calc(100%-96px)] xs:w-[calc(100%-24px)]',
  centerInnerDiv: 'flex flex-col',
  span: 'border-t border-border inline-block w-7/12 mdsm:w-full',
  navbarWrapper:
    'relative mdlg:absolute -left-0 transition-all duration-300 ease-in-out z-40 h-screen',
  sideWrapper: 'flex justify-between w-full relative',
  sideNavWrapper: 'relative mdsm:absolute -right-0 transition-all duration-300 ease-in-out z-40',
};

const TaskPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [render, setRender] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const taskId = useAppSelector((state) => state.singleTask.data?._id);
  const { taskPage, access, currentWorkspace } = useAppSelector((state) => state.taskData);
  const { user } = useAppSelector((state) => state.userSettings);
  const isLoading = useAppSelector((state) => state.singleTask.isLoading);
  const isError = useAppSelector((state) => state.singleTask.isLoading);
  const navBarRef = useRef(null);
  const sideNav = useRef(null);
  const svgRef = useRef(null);
  const workspaceUrl = params.workspace;
  const userHasAccess = access && access.id === user?._id && workspaceUrl === currentWorkspace.url;
  const urlRedirect = `/workspace/${workspaceUrl}/issue/${
    params.identifier
  }/${formatUrl(taskPage.title)}`;

  // Leave comment in: This can be styled into a spinner later

  // unused variable - commented out for later checks
  // const workspace = useSelector((state) => state.taskData.currentWorkspace);

  const toggleNav = (nav: string) => {
    if (nav === 'navBar') {
      setShowNavBar(!showNavBar);
    } else {
      setShowSideNav(!showSideNav);
    }
  };

  const toggleSideNav = () => toggleNav('sideNav');

  const resetTaskEventLog = () => {
    const clearedTaskEventLog = {
      taskId: '',
      author: {
        id: '',
        name: '',
      },
      createdAt: null,
      eventsLog: [],
      _id: '',
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
        }),
      );
      if (taskTitle) {
        if (formatUrl(params.issue as string) !== formatUrl(taskTitle.payload.title)) {
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
      if (svgRef.current && (svgRef.current as HTMLElement).contains(event.target as Node)) {
        setShowNavBar(false);
        return;
      }

      if (navBarRef.current && !(navBarRef.current as HTMLElement).contains(event.target as Node)) {
        setShowNavBar(false);
      }

      if (sideNav.current && !(sideNav.current as HTMLElement).contains(event.target as Node)) {
        setShowSideNav(false);
      }
    }

    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      {!render && isError && <LoadingTask />}
      {!render && isLoading && <LoadingTask />}
      {render && taskId && (
        <>
          <div className={styles.pageWrapper}>
            <div className="w-full flex flex-col px-12">
              <div className="flex w-full relative overflow-y-auto snap-y snap-mandatory">
                <TaskPageCenterContainer setShowSideNav={toggleSideNav} svgRef={svgRef} />
                <div className="flex flex-col">
                  <IssueSidebarTopRow />
                  <div
                    ref={sideNav}
                    className={`${styles.sideNavWrapper} ${
                      showSideNav
                        ? ' mdsm:-right-0 mdsm:top-20'
                        : ' mdsm:-right-[500px] mdsm:top-20'
                    }`}
                  >
                    <IssueSidebarContainer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskPage;
