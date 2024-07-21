'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getFilteredTasks, setFilteredTaskList } from '@/store/filterPage/actions';
import { setTaskList } from '@/store/taskData';
import { updateTaskAfterDrag } from '@/api/taskApi';
import { copyShareLink } from '@/components/Svg';
import TopNavBarDisplay from '@/components/TopNavBarDisplay';
import FilterView from '@/components/FilterView';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { OnDragEndResponder } from '@hello-pangea/dnd';
import type { Task } from '@/store/taskData/taskData.interfaces';

const styles = {
  container: 'bg-background w-full flex flex-row overflow-hidden relative px-8',
  homeBg: 'flex flex-col w-full h-screen bg-skin-fillHome relative bg-background',
  navbarDivParent:
    'my-8 bg-background lg:max-w-[calc(100vw-330px)] flex flex-col items-center justify-between',
  subTitleContainer: 'flex flex-row h-[inherit] overflow-auto mb-4 pl-6',
  navBarDiv: 'flex justify-between w-full items-center',
  titleText: 'text-foreground',
  navBarRight: 'flex items-center',
  showTaskForm: 'fixed inset-0 flex justify-center items-center z-50',
  filterStatusBar: 'w-full',
  filterSaveForm: 'w-[98%] m-3',
  errorWrapper: 'w-full h-full flex flex-col items-center justify-center text-foreground',
  errorTitle: 'text-2xl',
  navBarWrapper:
    'lg:flex lg:w-[330px] lg:left-0 lg:relative z-40 transition-all duration-300 ease-in-out',
  svg: 'w-4 h-4 mr-6 cursor-pointer',
  copiedAlertBox:
    'fixed bottom-5 right-5 w-auto bg-accent border border-border rounded px-4 py-4 transition-all delay-100 duration-1000',
  urlClipboard: 'text-foreground text-xs font-bold leading-6 mb-2',
  paste: 'text-muted-foreground text-xs font-bold',
};

const FilterPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const filteredTaskList = useSelector((state: RootState) => state.filterPage.filteredTaskList);
  const taskList = useSelector((state: RootState) => state.taskData.taskList);
  const teamId = useSelector((state: RootState) => state.taskData.currentTeam._id);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const filterId = params.filterId as string;
  const filterType = useSelector((state: RootState) => state.filterPage.filterType);

  useEffect(() => {
    const dashboardPage = false;
    dispatch(getFilteredTasks(teamId, filterId, dashboardPage, filterType));
  }, [dispatch, teamId, filterId, filterType]);

  const handleDragEnd: OnDragEndResponder = async (result) => {
    const { destination, source, draggableId } = result;

    const destinationUnchanged = destination?.droppableId === source.droppableId;

    if (!destination || destinationUnchanged) {
      return;
    }

    const draggedTaskFound = taskList.find((task: Task) => task && task._id === draggableId);

    const draggedFilterTask = filteredTaskList.find(
      (task: Task) => task && task._id === draggableId,
    );

    if (!draggedTaskFound || !draggedFilterTask) {
      return;
    }

    const taskWithNewStatus = {
      ...draggedTaskFound,
      status: destination.droppableId,
    };

    const destinationIndex = taskList.findIndex((task: Task) => task && task._id === draggableId);

    const destinationFilterIndex = filteredTaskList.findIndex(
      (task: Task) => task && task._id === draggableId,
    );
    const droppableId = destination.droppableId;

    const updatedTaskList = [...taskList];
    updatedTaskList.splice(destinationIndex, 1, taskWithNewStatus);
    const updatedFilteredTaskList = [...filteredTaskList];
    updatedFilteredTaskList.splice(destinationFilterIndex, 1, taskWithNewStatus);

    dispatch(setTaskList(updatedTaskList));
    dispatch(setFilteredTaskList(updatedFilteredTaskList));
    await updateTaskAfterDrag(draggedTaskFound, droppableId);
  };

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/filter/${filterId}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsLinkCopied(true);
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy the link: ', error);
    }
  };

  useEffect(() => {
    const dashboardPage = false;
    dispatch(getFilteredTasks(teamId, filterId, dashboardPage, filterType));
  }, [dispatch, teamId, filterId, filterType]);

  return (
    <div className={styles.container}>
      <div className={styles.homeBg}>
        <div className={styles.navbarDivParent}>
          <div className={styles.navBarDiv}>
            <div className={styles.titleText}>Test View</div>
            <div className={styles.navBarRight}>
              <button type="button" className={styles.svg} onClick={handleCopyShareLink}>
                {copyShareLink()}
              </button>
              <TopNavBarDisplay />
            </div>
          </div>
        </div>
        <FilterView handleDragEnd={handleDragEnd} />
      </div>
      <div className={`${styles.copiedAlertBox} ${isLinkCopied ? 'opacity-100' : 'opacity-0'}`}>
        <p className={styles.urlClipboard}>Share link copied to clipboard!</p>
        <p className={styles.paste}>Paste it wherever you like</p>
      </div>
    </div>
  );
};

export default FilterPage;
