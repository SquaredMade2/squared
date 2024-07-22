'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTaskCard, updateTaskAfterDrag } from '@/api/taskApi';
import { getTeam, getAllTasks } from '@/store/taskData/thunks';
import { setTaskList } from '@/store/taskData';
import TopNavBar from '@/components/TopNavBar';
import ViewAllTasks from '@/components/ViewAllTasks';
import SelectedFiltersBar from '@/components/SelectedFiltersBar/index';
import FilterSaveForm from '@/components/FilterSaveForm';
import { navBarToggle } from '@/store/userSettings';
import type { RootState } from '@/store';
import type { OnDragEndResponder } from '@hello-pangea/dnd';
import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

const styles = {
  container: 'flex flex-row relative w-[calc(100%-296px)]',
  homeBackground: 'flex items-center flex-col w-screen h-full bg-background ',
  homeBackgroundWrapper: 'w-full snap-x overflow-y-hidden relative',
  navbarDivParent:
    'bg-background w-[calc(100vw-296px)] flex flex-col items-center justify-between mb-2',
  navBarDiv: 'w-full px-8',
  showTaskForm: 'fixed inset-0 flex justify-center items-center z-50',
  filterStatusBar: 'w-full',
  filterSaveForm: 'w-[98%] m-3',
  errorWrapper: 'w-full h-full flex flex-col items-center justify-center text-foreground',
  errorTitle: 'text-2xl',
  navBarWrapper: ' h-screen lg:left-0 lg:relative z-40 transition-all duration-300 ease-in-out',
};

export default function Home() {
  const dispatch = useDispatch();
  // Commenting out for now because of build error
  // const { notifications } = useAppSelector((state) => state.notifications);
  const router = useRouter();
  const params = useParams();
  const { theme, view, user, showNavBar } = useSelector((state: RootState) => state.userSettings);

  const workSpaceError = useSelector((state: RootState) => state.taskData.error);
  const { currentTeam, access, currentWorkspace } = useSelector(
    (state: RootState) => state.taskData,
  );

  const taskList = useSelector((state: RootState) => state.taskData.taskList);
  const [isLoading] = useState(false);
  const [filterOption, setFilterOption] = useState<FilterOption | null>(null);
  const [showFilterSaveForm, setShowFilterSaveForm] = useState(false);
  const workspaceUrl = params.workspace;
  const teamIdentifier = params.identifier;
  const userHasAccess = access && access.id === user?._id && workspaceUrl === currentWorkspace.url;
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
      router.push(`/workspace/${workspaceUrl}`);
    }
  }, [dispatch, teamIdentifier, userHasAccess, workspaceUrl, router]);

  const activeSelected = params.all === 'active';
  const backlogSelected = params.all === 'backlog';

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskCard(taskId);
    dispatch(getAllTasks(currentTeam) as never);
  };

  const handleDragEnd: OnDragEndResponder = async (result) => {
    const { destination, source, draggableId } = result;

    const destinationUnchanged = destination?.droppableId === source.droppableId;

    if (!destination || destinationUnchanged) {
      return;
    }

    const draggedTaskFound = taskList.find((task) => task && task._id === draggableId);

    if (!draggedTaskFound) {
      return;
    }

    const taskWithNewStatus = {
      ...draggedTaskFound,
      status: destination.droppableId,
    };

    const sourceIndex = taskList.findIndex((task) => task && task._id === draggableId);
    const destinationIndex = taskList.findIndex((task) => task && task._id === draggableId);

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

    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [dispatch]);

  return (
    <>
      {!isLoading && !workSpaceError && (
        <div
          className={`${styles.container} ${
            view === 'grid' && theme === 'light' ? 'bg-background' : 'bg-card'
          } ${theme}`}
        >
          <div className={styles.homeBackground}>
            <div
              className={`${styles.homeBackgroundWrapper} ${
                view === 'grid' ? 'h-full' : 'h-[calc(100vh-24px)]'
              }`}
            >
              <div className={styles.navbarDivParent}>
                {!showFilterSaveForm && (
                  <div className={`${styles.navBarDiv} `}>
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
                  <div className={styles.filterSaveForm}>
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
          className={`${styles.container} ${
            view === 'grid' && theme === 'light' ? 'bg-background' : 'bg-card'
          } ${theme}`}
        >
          <div
            className={`${styles.navBarWrapper} ${
              showNavBar ? 'absolute -left-full' : 'absolute left-0'
            } `}
          >
            {/* <Navbar /> */}
          </div>

          <div className={styles.homeBackground}>
            <div className={styles.navbarDivParent}>
              {!showFilterSaveForm && (
                <div className={styles.navBarDiv}>
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
                <div className={`${styles.filterStatusBar}`}>
                  <SelectedFiltersBar
                    showFilterSaveForm={showFilterSaveForm}
                    filterOption={filterOption}
                    handleFilter={handleFilter}
                    handleFilterSaveForm={handleFilterSaveForm}
                  />
                </div>
              )}
              {showFilterSaveForm && (
                <div className={`${styles.filterSaveForm}`}>
                  <FilterSaveForm
                    filterOption={filterOption}
                    setShowFilterSaveForm={setShowFilterSaveForm}
                    handleFilter={handleFilter}
                    handleFilterSaveForm={handleFilterSaveForm}
                  />
                </div>
              )}
            </div>
            <div className={styles.errorWrapper}>
              <h1 className={styles.errorTitle}>Team not found</h1>
              <p>There is no team with identifer {`"${teamIdentifier}"`}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
