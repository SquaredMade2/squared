'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { getFilteredViews } from '@/store/filterPage/actions';
import type { RootState } from '@/store';
import { deleteTaskCard, updateTaskAfterDrag } from '@/api/taskApi';
import { getAllTasks } from '@/store/taskData/thunks';
import { setTaskList } from '@/store/taskData';
import FilterSaveForm from '@/components/FilterSaveForm';
import ViewAllTasks from '@/components/ViewAllTasks';
import ViewNewFilters from '@/components/ViewNewFilters';
import ViewNewTopNavBar from '@/components/ViewNewTopNavBar';
import type { DragResult } from '@/components/ViewAllTasks/ViewAllTasks.interfaces';
import type { FilterOption } from '@/app/interfaces/Filter.interfaces';
import type { OnDragEndResponder } from '@hello-pangea/dnd';

const styles = {
  container: 'flex flex-row overflow-hidden relative',
  homeBackground: 'flex items-center flex-col w-full h-screen bg-background ',
  homeBackgroundWrapper: 'w-full px-8 h-screen snap-x relative',
  navbarDivParent: 'bg-card w-full flex flex-col items-center justify-between mb-2',
  navBarDiv: 'w-full',
  filterSaveForm: 'w-[98%] m-3',
  navBarWrapper: ' h-screen lg:left-0 lg:relative z-40 transition-all duration-300 ease-in-out',
};

const ViewsPage: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [showFilterSaveForm, setShowFilterSaveForm] = useState(false);
  const [filterOption, setFilterOption] = useState<FilterOption | null>(null);
  const { currentTeam } = useSelector((state: RootState) => state.taskData);
  const taskList = useSelector((state: RootState) => state.taskData.taskList);
  const teamId = useSelector((state: RootState) => state.taskData.currentTeam._id);
  const activeSelected = params.all === 'active';
  const backlogSelected = params.all === 'backlog';

  const handleFilter = (filterValue: FilterOption | null) => {
    setFilterOption(filterValue);
  };

  const handleFilterSaveForm = (value: boolean) => {
    setShowFilterSaveForm(value);
  };

  const handleDragEnd = async (result: DragResult) => {
    const { destination, source, draggableId } = result;

    const destinationUnchanged = destination.droppableId === source.droppableId;

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

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskCard(taskId);
    dispatch(getAllTasks(currentTeam));
  };

  useEffect(() => {
    dispatch(getFilteredViews(teamId));
  }, []);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.homeBackground}>
        <div className={styles.homeBackgroundWrapper}>
          <ViewNewTopNavBar showFilterSaveForm={showFilterSaveForm} />
          <div className={styles.navbarDivParent}>
            {!showFilterSaveForm && (
              <div className={styles.navBarDiv}>
                <ViewNewFilters
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
                  redirectToViewsOnCreate={true}
                />
              </div>
            )}
          </div>

          <ViewAllTasks
            activeSelected={activeSelected}
            backlogSelected={backlogSelected}
            handleDragEnd={handleDragEnd as OnDragEndResponder}
            handleDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewsPage;
